// screensDoctor/MedicationFormScreen.jsx
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function MedicationFormScreen({ route, navigation }) {
  const { mode, patientId, patientName, medication } = route.params;
  const [doctorId, setDoctorId] = useState(null);

  const [filteredMedNames, setFilteredMedNames] = useState([]);
  const [showMedNames, setShowMedNames] = useState(false);
  const [showOtherMedFields, setShowOtherMedFields] = useState(mode === "edit");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(null);
  const [isPickingTime, setIsPickingTime] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  const medicationNameRef = useRef(null);
  const scrollRef = useRef(null);

  const [form, setForm] = useState({
    id: medication?.id || null,
    patientName,
    patientId,
    name: medication?.name || "",
    medicationId: medication?.medicationId || null,
    dosage: medication?.dosage || "",
    frequency: medication?.frequency || "",
    doseTime: medication?.doseTime || "",
    timeToTake: medication?.timeToTake || "",
    additionalInstructions: medication?.additionalInstructions || "",
  });

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const stored = await AsyncStorage.getItem("doctor_id");
        setDoctorId(stored ? parseInt(stored, 10) : 420094999);
      } catch {
        setDoctorId(420094999);
      }
    };
    loadDoctor();
  }, []);

  const fetchMedNames = async (text) => {
    try {
      const url = `${
        AbedEndPoint.patientMedsMedications
      }?q=${encodeURIComponent(text)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("err");
      const data = await res.json();
      const list = (Array.isArray(data) ? data : []).map((d) => ({
        id: d.id,
        name: d.name || d.label || "",
        label: d.label || d.name || "",
      }));
      setFilteredMedNames(list);
      setShowMedNames(list.length > 0);
    } catch {
      setFilteredMedNames([]);
      setShowMedNames(false);
      Alert.alert("خطأ", "تعذر جلب الأدوية من الخادم.");
    }
  };

  const handleMedicationNameChange = (text) => {
    setForm((prev) => ({ ...prev, name: text, medicationId: null }));
    if (text.trim() === "") {
      setFilteredMedNames([]);
      setShowMedNames(false);
      setShowOtherMedFields(false);
      return;
    }
    fetchMedNames(text);
    setShowOtherMedFields(false);
  };

  const selectMedicationName = (item) => {
    setForm((prev) => ({
      ...prev,
      name: item.label || item.name,
      medicationId: item.id,
    }));
    setFilteredMedNames([]);
    setShowMedNames(false);
    setShowOtherMedFields(true);
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true })
    );
  };

  const onTimeChange = (event, selectedTime) => {
    if (Platform.OS === "android") {
      if (event.type === "dismissed") {
        setShowTimePicker(false);
        setTempTime(null);
        setIsPickingTime(false);
        setTimeFocused(false);
        return;
      }
      if (event.type === "set" && selectedTime) {
        const hours = String(selectedTime.getHours()).padStart(2, "0");
        const minutes = String(selectedTime.getMinutes()).padStart(2, "0");
        setForm((p) => ({ ...p, timeToTake: `${hours}:${minutes}` }));
        setShowTimePicker(false);
        setTempTime(null);
        setIsPickingTime(false);
        setTimeFocused(false);
      }
    } else {
      if (selectedTime) setTempTime(selectedTime);
    }
  };

  const saveTempTimeAndClosePicker = () => {
    const finalTime = tempTime || new Date();
    const hours = String(finalTime.getHours()).padStart(2, "0");
    const minutes = String(finalTime.getMinutes()).padStart(2, "0");
    setForm((p) => ({ ...p, timeToTake: `${hours}:${minutes}` }));
    setShowTimePicker(false);
    setTempTime(null);
    setIsPickingTime(false);
    setTimeFocused(false);
  };

  const onFocusInput = () => {
    if (isPickingTime) Keyboard.dismiss();
  };

  const handleSave = async () => {
    if (
      !form.patientId ||
      !form.name.trim() ||
      !form.dosage.trim() ||
      !form.frequency.trim() ||
      !form.doseTime.trim() ||
      !form.timeToTake.trim()
    ) {
      Alert.alert("تنبيه", "يرجى تعبئة الحقول الأساسية");
      return;
    }
    if (!form.medicationId)
      return Alert.alert(
        "تنبيه",
        "اختر الدواء من القائمة القادمة من الداتا بيز."
      );
    if (!doctorId) return Alert.alert("خطأ", "تعذر تحديد رقم الطبيب.");

    const body = {
      patient_id: form.patientId,
      medication_id: form.medicationId,
      dose_text: form.dosage,
      frequency_text: form.frequency,
      dose_time: form.timeToTake,
      instructions: form.additionalInstructions,
      start_date: null,
      end_date: null,
    };

    try {
      if (route?.params?.mode === "edit" && form.id) {
        const url = `${AbedEndPoint.patientMedicationById(
          form.id
        )}?doctor_id=${encodeURIComponent(doctorId)}`;
        const res = await fetch(url, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.text()) || "تعذر تعديل الدواء");
      } else {
        const url = `${
          AbedEndPoint.patientMedsList
        }?doctor_id=${encodeURIComponent(doctorId)}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error((await res.text()) || "تعذر إضافة الدواء");
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert("خطأ", err.message || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={{ paddingBottom: spacing.xxl + 28 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[styles.modalTitle, styles.rtlText]}>
          {route?.params?.mode === "edit"
            ? `تعديل دواء لـ ${patientName}`
            : `جدولة دواء لـ ${patientName}`}
        </Text>

        <Text style={[styles.label, styles.rtlText]}>اسم المريض</Text>
        <TextInput
          style={[styles.input, styles.rtlText, styles.disabledInput]}
          value={patientName}
          editable={false}
        />

        <Text style={[styles.label, styles.rtlText]}>اسم الدواء</Text>
        <TextInput
          ref={medicationNameRef}
          style={[styles.input, styles.rtlText]}
          placeholder="أدخل اسم الدواء"
          placeholderTextColor={colors.textMuted}
          value={form.name}
          onChangeText={handleMedicationNameChange}
          onFocus={onFocusInput}
        />

        {showMedNames && (
          <View style={styles.medNamesList}>
            {filteredMedNames.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.medNameItem}
                onPress={() => selectMedicationName(item)}
                activeOpacity={0.9}
              >
                <Text style={[styles.rtlText, { color: colors.textPrimary }]}>
                  {item.label || item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {showOtherMedFields && (
          <>
            <Text style={[styles.label, styles.rtlText]}>الجرعة</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل الجرعة"
              placeholderTextColor={colors.textMuted}
              value={form.dosage}
              onChangeText={(text) => setForm({ ...form, dosage: text })}
              onFocus={onFocusInput}
            />

            <Text style={[styles.label, styles.rtlText]}>التكرار</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل التكرار"
              placeholderTextColor={colors.textMuted}
              value={form.frequency}
              onChangeText={(text) => setForm({ ...form, frequency: text })}
              onFocus={onFocusInput}
            />

            <Text style={[styles.label, styles.rtlText]}>وقت الجرعة</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل وقت الجرعة (مثلاً: صباحاً، مساءً)"
              placeholderTextColor={colors.textMuted}
              value={form.doseTime}
              onChangeText={(text) => setForm({ ...form, doseTime: text })}
              onFocus={onFocusInput}
            />

            <Text style={[styles.label, styles.rtlText]}>الساعة المخصصة</Text>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                setIsPickingTime(true);
                setTimeFocused(true);
                if (form.timeToTake) {
                  const [h, m] = form.timeToTake.split(":");
                  const d = new Date();
                  d.setHours(Number(h));
                  d.setMinutes(Number(m));
                  setTempTime(d);
                } else setTempTime(new Date());
                setShowTimePicker(true);
                requestAnimationFrame(() =>
                  scrollRef.current?.scrollToEnd({ animated: true })
                );
              }}
              style={[
                styles.input,
                styles.timePickerButton,
                styles.rtlText,
                timeFocused && styles.timePickerButtonFocused,
              ]}
              activeOpacity={0.9}
            >
              <Text
                style={[
                  styles.rtlText,
                  {
                    color: form.timeToTake
                      ? colors.textPrimary
                      : colors.textMuted,
                  },
                ]}
              >
                {form.timeToTake || "اختر الساعة"}
              </Text>
              <Ionicons name="alarm" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            {showTimePicker && (
              <View>
                <DateTimePicker
                  value={tempTime || new Date()}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "clock"}
                  onChange={onTimeChange}
                  themeVariant="light"
                />
                {Platform.OS === "ios" && (
                  <View style={styles.iosTimeActions}>
                    <TouchableOpacity
                      style={styles.iosBtn}
                      onPress={() => {
                        setShowTimePicker(false);
                        setTempTime(null);
                        setIsPickingTime(false);
                        setTimeFocused(false);
                      }}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.iosBtnText}>إلغاء</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iosBtn}
                      onPress={saveTempTimeAndClosePicker}
                      activeOpacity={0.9}
                    >
                      <Text style={styles.iosBtnText}>تم</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            <Text style={[styles.label, styles.rtlText]}>تعليمات إضافية</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل أي تعليمات إضافية"
              placeholderTextColor={colors.textMuted}
              value={form.additionalInstructions}
              onChangeText={(text) =>
                setForm({ ...form, additionalInstructions: text })
              }
              onFocus={() => {
                onFocusInput();
                requestAnimationFrame(() =>
                  scrollRef.current?.scrollToEnd({ animated: true })
                );
              }}
            />
          </>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <Ionicons
              name={
                route?.params?.mode === "edit"
                  ? "checkmark-done"
                  : "add-circle-outline"
              }
              size={20}
              color={colors.buttonSuccessText}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText}>
              {route?.params?.mode === "edit" ? "حفظ التعديلات" : "إضافة"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            activeOpacity={0.9}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={colors.buttonDangerText}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundLight },

  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm + 4,
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  modalTitle: {
    fontSize: typography.headingMd,
    fontWeight: "bold",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xl,
    fontFamily: typography.fontFamily,
  },

  label: {
    fontSize: typography.bodyMd,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    fontFamily: typography.fontFamily,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: Platform.select({ ios: spacing.md, android: spacing.md - 2 }),
    borderRadius: radii.sm,
    backgroundColor: colors.background,
    fontSize: typography.bodyLg,
    color: colors.textPrimary,
    marginBottom: spacing.sm + 2,
    fontFamily: typography.fontFamily,
    ...shadows.light,
  },

  disabledInput: {
    backgroundColor: colors.buttonMuted,
    color: colors.textMuted,
  },

  medNamesList: {
    maxHeight: 140,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.sm,
    marginBottom: spacing.sm + 2,
    overflow: "hidden",
  },

  medNameItem: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.border,
  },

  timePickerButton: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radii.sm,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm + 2,
  },

  timePickerButtonFocused: {
    borderColor: colors.success,
  },

  iosTimeActions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginTop: spacing.sm,
  },

  iosBtn: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.buttonSuccess,
    borderRadius: radii.sm - 2,
    marginLeft: spacing.sm,
  },

  iosBtnText: {
    color: colors.buttonSuccessText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
  },

  buttonContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },

  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.sm,
    justifyContent: "center",
    ...shadows.medium,
  },

  saveButton: {
    backgroundColor: colors.buttonSuccess,
    marginRight: spacing.sm,
  },

  cancelButton: {
    backgroundColor: colors.buttonDanger,
    marginLeft: spacing.sm,
  },

  btnText: {
    color: colors.background,
    fontSize: typography.bodyLg,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
  },
});
