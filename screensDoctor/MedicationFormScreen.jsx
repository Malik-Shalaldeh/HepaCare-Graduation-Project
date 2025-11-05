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
  StatusBar,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import ScreenWithDrawer from "./ScreenWithDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://192.168.1.120:8000";

export default function MedicationFormScreen({ route, navigation }) {
  const { mode, patientId, patientName, medication } = route.params;
  const [doctorId, setDoctorId] = useState(null);

  const [filteredMedNames, setFilteredMedNames] = useState([]);
  const [showMedNames, setShowMedNames] = useState(false);
  const [showOtherMedFields, setShowOtherMedFields] = useState(
    mode === "edit" ? true : false
  );

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [tempTime, setTempTime] = useState(null);
  const [isPickingTime, setIsPickingTime] = useState(false);
  const [timeFocused, setTimeFocused] = useState(false);

  const medicationNameRef = useRef(null);
  const scrollRef = useRef(null); // ✅ عشان ننزل الشاشة

  const [form, setForm] = useState({
    id: medication?.id || null,
    patientName: patientName,
    patientId: patientId,
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
        if (stored) setDoctorId(parseInt(stored, 10));
        else setDoctorId(420094999);
      } catch {
        setDoctorId(420094999);
      }
    };
    loadDoctor();
  }, []);

  // جلب الأدوية من الباك اند
  const fetchMedNames = async (text) => {
    try {
      const res = await fetch(
        `${API}/patient-medications/medications?q=${encodeURIComponent(text)}`
      );
      if (!res.ok) throw new Error("err");
      const data = await res.json();
      const list = data.map((d) => ({
        id: d.id,
        name: d.name || d.label || "",
        label: d.label || d.name || "",
      }));
      setFilteredMedNames(list);
      setShowMedNames(list.length > 0);
    } catch (err) {
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

    // ✅ بعد ما يختار الدواء، ننزل شوية عشان يشوف الحقول
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
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
        const hours = selectedTime.getHours().toString().padStart(2, "0");
        const minutes = selectedTime.getMinutes().toString().padStart(2, "0");
        const formattedTime = `${hours}:${minutes}`;
        setForm((prev) => ({ ...prev, timeToTake: formattedTime }));
        setShowTimePicker(false);
        setTempTime(null);
        setIsPickingTime(false);
        setTimeFocused(false);
      }
    } else {
      if (selectedTime) {
        setTempTime(selectedTime);
      }
    }
  };

  const saveTempTimeAndClosePicker = () => {
    const finalTime = tempTime || new Date();
    if (finalTime) {
      const hours = finalTime.getHours().toString().padStart(2, "0");
      const minutes = finalTime.getMinutes().toString().padStart(2, "0");
      const formattedTime = `${hours}:${minutes}`;
      setForm((prev) => ({ ...prev, timeToTake: formattedTime }));
    }
    setShowTimePicker(false);
    setTempTime(null);
    setIsPickingTime(false);
    setTimeFocused(false);
  };

  const onFocusInput = () => {
    if (isPickingTime) {
      Keyboard.dismiss();
      return;
    }
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
    if (!form.medicationId) {
      Alert.alert("تنبيه", "اختر الدواء من القائمة القادمة من الداتا بيز.");
      return;
    }
    if (!doctorId) {
      Alert.alert("خطأ", "تعذر تحديد رقم الطبيب.");
      return;
    }

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
      if (mode === "edit" && form.id) {
        const res = await fetch(
          `${API}/patient-medications/${form.id}?doctor_id=${doctorId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "تعذر تعديل الدواء");
        }
      } else {
        const res = await fetch(
          `${API}/patient-medications/?doctor_id=${doctorId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          }
        );
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "تعذر إضافة الدواء");
        }
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert("خطأ", err.message || "حدث خطأ أثناء الحفظ");
    }
  };

  return (
    <ScreenWithDrawer title={mode === "edit" ? "تعديل الدواء" : "جدولة دواء"}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea} />
      <ScrollView
        ref={scrollRef} // ✅
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* رجوع */}
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={[styles.modalTitle, styles.rtlText]}>
          {mode === "edit"
            ? `تعديل دواء لـ ${patientName}`
            : `جدولة دواء لـ ${patientName}`}
        </Text>

        {/* اسم المريض */}
        <Text style={[styles.label, styles.rtlText]}>اسم المريض</Text>
        <TextInput
          style={[styles.input, styles.rtlText, styles.disabledInput]}
          value={patientName}
          editable={false}
        />

        {/* اسم الدواء */}
        <Text style={[styles.label, styles.rtlText]}>اسم الدواء</Text>
        <TextInput
          ref={medicationNameRef}
          style={[styles.input, styles.rtlText]}
          placeholder="أدخل اسم الدواء"
          placeholderTextColor="#888"
          value={form.name}
          onChangeText={handleMedicationNameChange}
          onFocus={onFocusInput}
        />

        {/* لستة الأدوية */}
        {showMedNames && (
          <View style={styles.medNamesList}>
            {filteredMedNames.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.medNameItem}
                onPress={() => selectMedicationName(item)}
              >
                <Text style={[styles.rtlText, { color: "#333" }]}>
                  {item.label || item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* باقي الحقول */}
        {showOtherMedFields && (
          <>
            <Text style={[styles.label, styles.rtlText]}>الجرعة</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل الجرعة"
              placeholderTextColor="#888"
              value={form.dosage}
              onChangeText={(text) => setForm({ ...form, dosage: text })}
              onFocus={onFocusInput}
            />

            <Text style={[styles.label, styles.rtlText]}>التكرار</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل التكرار"
              placeholderTextColor="#888"
              value={form.frequency}
              onChangeText={(text) => setForm({ ...form, frequency: text })}
              onFocus={onFocusInput}
            />

            <Text style={[styles.label, styles.rtlText]}>وقت الجرعة</Text>
            <TextInput
              style={[styles.input, styles.rtlText]}
              placeholder="أدخل وقت الجرعة (مثلاً: صباحاً، مساءً)"
              placeholderTextColor="#888"
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
                } else {
                  setTempTime(new Date());
                }

                setShowTimePicker(true);

                // ✅ ننزل تحت عشان البيكر ما يختفي
                requestAnimationFrame(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                });
              }}
              style={[
                styles.input,
                styles.timePickerButton,
                styles.rtlText,
                timeFocused && styles.timePickerButtonFocused,
              ]}
            >
              <Text
                style={[
                  styles.rtlText,
                  {
                    color: form.timeToTake ? "#000" : "#888",
                  },
                ]}
              >
                {form.timeToTake || "اختر الساعة"}
              </Text>
              <Ionicons name="alarm" size={20} color="#555" />
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
                    >
                      <Text style={styles.iosBtnText}>إلغاء</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.iosBtn}
                      onPress={saveTempTimeAndClosePicker}
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
              placeholderTextColor="#888"
              value={form.additionalInstructions}
              onChangeText={(text) =>
                setForm({ ...form, additionalInstructions: text })
              }
              onFocus={() => {
                onFocusInput();
                // ✅ أهم سطر: لما يضغط على آخر فيلد ننزل تحت
                requestAnimationFrame(() => {
                  scrollRef.current?.scrollToEnd({ animated: true });
                });
              }}
            />
          </>
        )}

        {/* أزرار */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleSave}
          >
            <Ionicons
              name={mode === "edit" ? "checkmark-done" : "add-circle-outline"}
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText}>
              {mode === "edit" ? "حفظ التعديلات" : "إضافة"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.btnText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  backArrow: {
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: Platform.select({ ios: 12, android: 10 }),
    borderRadius: 8,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  disabledInput: {
    backgroundColor: "#F0F0F0",
    color: "#777",
  },
  medNamesList: {
    maxHeight: 140,
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginBottom: 10,
  },
  medNameItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EEE",
  },
  timePickerButton: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  timePickerButtonFocused: {
    borderColor: "#4CAF50",
  },
  iosTimeActions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
    marginTop: 8,
  },
  iosBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#4CAF50",
    borderRadius: 6,
    marginLeft: 8,
  },
  iosBtnText: {
    color: "#fff",
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: "center",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    marginRight: 8,
  },
  cancelButton: {
    backgroundColor: "#F44336",
    marginLeft: 8,
  },
  btnText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
