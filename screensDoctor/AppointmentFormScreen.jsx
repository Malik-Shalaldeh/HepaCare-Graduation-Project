// sami - Appointment form with unified theme
import React, { useState, useContext, useEffect } from "react";
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

import ScreenWithDrawer from "./ScreenWithDrawer";
import { AppointmentsContext } from "../contexts/AppointmentsContext";
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
  const { saveAppointment, patientOptions, loading } =
    useContext(AppointmentsContext);

  const editingAppointment = route.params?.appointment;
  const isEditing = Boolean(editingAppointment);

  const [open, setOpen] = useState(false);
  const [patient, setPatient] = useState(
    editingAppointment?.patientId ?? null
  );
  const [patientsItems, setPatientsItems] = useState(patientOptions);
  const [notes, setNotes] = useState(editingAppointment?.notes ?? "");
  const [date, setDate] = useState(
    editingAppointment ? new Date(editingAppointment.startAt) : new Date()
  );
  const [time, setTime] = useState(
    editingAppointment ? new Date(editingAppointment.startAt) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const screenTitle = isEditing ? "تعديل موعد" : "موعد جديد";

  useEffect(() => {
    setPatientsItems(patientOptions);
  }, [patientOptions]);

  const combineDateAndTime = (dateValue, timeValue) => {
    const combined = new Date(dateValue);
    combined.setHours(timeValue.getHours(), timeValue.getMinutes(), 0, 0);
    return combined;
  };

  const handleSubmit = async () => {
    if (!patient) {
      Alert.alert("تنبيه", "يرجى اختيار المريض قبل حفظ الموعد");
      return;
    }

    try {
      setSaving(true);
      const startDate = combineDateAndTime(date, time);
      const sqlDate = toSqlDateTime(startDate);

      await saveAppointment({
        id: editingAppointment?.id,
        patientId: patient,
        startAt: sqlDate,
        notes: notes.trim(),
      });

      navigation.goBack();
    } catch (err) {
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
        {loading && !patientsItems.length ? (
          <ActivityIndicator color={primary} style={styles.loader} />
        ) : null}

        {!loading && patientsItems.length === 0 ? (
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
          disabled={saving || loading}
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
