// sami - Refactored to Malik-style
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import ScreenWithDrawer from "./ScreenWithDrawer";
import ENDPOINTS from "../samiendpoint";
import {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from "../style/theme";

const primary = colors.buttonPrimary || colors.primary;

const formatDate = (value) => value.toLocaleDateString();
const formatTime = (value) =>
  value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
const toSqlDateTime = (value) =>
  value.toISOString().slice(0, 19).replace("T", " ");

const AppointmentFormScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const editingAppointment = route.params?.appointment;
  const isEditing = Boolean(editingAppointment);

  // state
  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState(
    editingAppointment?.patientId ?? null
  );
  const [patientsItems, setPatientsItems] = useState([]);
  const [notes, setNotes] = useState(editingAppointment?.notes ?? "");
  const [date, setDate] = useState(
    editingAppointment ? new Date(editingAppointment.startAt) : new Date()
  );
  const [time, setTime] = useState(
    editingAppointment ? new Date(editingAppointment.startAt) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [isLoading, setIsLoading] = useState(false); // for fetching patients
  const [saving, setSaving] = useState(false); // for submitting form
  const [error, setError] = useState(null);

  const screenTitle = isEditing ? "تعديل موعد" : "موعد جديد";

  // load patients on mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setIsLoading(true);
        const doctorId = await AsyncStorage.getItem("doctor_id");

        if (!doctorId) {
          setError("يرجى تسجيل الدخول أولاً");
          return;
        }

        const response = await axios.get(`${ENDPOINTS.patientsList}?doctor_id=${doctorId}`);
        const data = response.data || [];

        const options = data.map((p) => ({
          label: p.name || p.full_name || `مريض رقم ${p.id}`,
          value: p.id,
        }));

        setPatientsItems(options);
      } catch (err) {
        console.error("Error loading patients:", err);
        Alert.alert("خطأ", "تعذر تحميل قائمة المرضى");
      } finally {
        setIsLoading(false);
      }
    };

    loadPatients();
  }, []);

  const combineDateAndTime = (dateValue, timeValue) => {
    const combined = new Date(dateValue);
    combined.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);
    return combined;
  };

  // submit form
  const handleSubmit = async () => {
    if (!patient) {
      Alert.alert("تنبيه", "يرجى اختيار المريض قبل حفظ الموعد");
      return;
    }

    try {
      setSaving(true);
      const doctorId = await AsyncStorage.getItem("doctor_id");

      if (!doctorId) {
        Alert.alert("خطأ", "لا يوجد رقم طبيب محفوظ");
        return;
      }

      const startDate = combineDateAndTime(date, time);
      const sqlDate = toSqlDateTime(startDate);

      const payload = {
        patient_id: patient,
        doctor_id: Number(doctorId),
        start_at: sqlDate,
        notes: notes.trim(),
      };

      if (isEditing) {
        await axios.put(ENDPOINTS.doctorAppointmentUpdate(editingAppointment.id), payload);
      } else {
        await axios.post(ENDPOINTS.doctorAppointmentCreate, payload);
      }

      navigation.goBack();
    } catch (err) {
      console.error("Error saving appointment:", err);
      Alert.alert("خطأ", err.message || "تعذر حفظ الموعد");
    } finally {
      setSaving(false);
    }
  };

  const handleDateChange = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleTimeChange = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <ScreenWithDrawer title={screenTitle} showDrawerIcon={false}>
      <View style={styles.container}>
        {isLoading && !patientsItems.length ? (
          <ActivityIndicator color={primary} style={styles.loader} />
        ) : null}

        {!isLoading && patientsItems.length === 0 ? (
          <Text style={styles.info}>
            لا يوجد مرضى حاليًا لعرضهم. يرجى إضافة مرضى أولاً.
          </Text>
        ) : null}

        <Text style={styles.label}>اسم المريض</Text>
        <DropDownPicker
          open={open}
          value={patient}
          items={patientsItems}
          setOpen={setOpen}
          setValue={setPatient}
          setItems={setPatientsItems}
          placeholder="اختر اسم المريض"
          disabled={!patientsItems.length}
          searchable
          searchPlaceholder="ابحث عن مريض"
          zIndex={3000}
          zIndexInverse={1000}
          style={styles.dropdown}
          dropDownContainerStyle={styles.dropdownContainer}
          listMode="SCROLLVIEW"
        />

        <Text style={styles.label}>التاريخ</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="calendar" size={20} color={primary} />
          <Text style={styles.pickerText}>{formatDate(date)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>الوقت</Text>
        <TouchableOpacity
          style={styles.picker}
          onPress={() => setShowTimePicker(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="time" size={20} color={primary} />
          <Text style={styles.pickerText}>{formatTime(time)}</Text>
        </TouchableOpacity>

        <Text style={styles.label}>ملاحظات</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          placeholder="أي ملاحظات إضافية"
          value={notes}
          onChangeText={setNotes}
          multiline
          placeholderTextColor={colors.textMuted}
        />

        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSubmit}
          activeOpacity={0.8}
          disabled={saving || isLoading}
        >
          {saving ? (
            <ActivityIndicator color={colors.buttonPrimaryText} />
          ) : (
            <Text style={styles.saveText}>
              {isEditing ? "حفظ التعديلات" : "حفظ الموعد"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>العودة إلى القائمة</Text>
        </TouchableOpacity>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleTimeChange}
        />
      )}
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
  },
  label: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  notesInput: {
    minHeight: 80,
    textAlignVertical: "top",
  },
  picker: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  pickerText: {
    marginStart: spacing.sm,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: primary,
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: "center",
    marginTop: spacing.sm,
    ...shadows.medium,
  },
  saveText: {
    color: colors.buttonPrimaryText,
    fontSize: typography.bodyMd,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
  },
  backBtn: {
    backgroundColor: colors.surface || "#ccc",
    padding: spacing.md,
    borderRadius: radii.lg,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    backgroundColor: colors.background,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },
  backText: {
    color: colors.textPrimary,
    fontSize: typography.bodyMd,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
  },
  info: {
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    textAlign: "center",
    fontSize: typography.bodySm,
  },
  loader: {
    marginVertical: spacing.sm,
  },
});

export default AppointmentFormScreen;
