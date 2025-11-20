// AddPatientStep1Screen.jsx
import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function AddPatientStep1Screen() {
  const navigation = useNavigation();

  const scrollRef = useRef(null);

  const fullNameRef = useRef(null);
  const idNumberRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const ageRef = useRef(null);
  const clinicRef = useRef(null);

  const [focused, setFocused] = useState(null);

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [tempDOB, setTempDOB] = useState(new Date());

  const [newPatient, setNewPatient] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    address: "",
    dob: "",
    age: "",
    gender: "",
    clinic: "",
    diseases: [],
    customDiseases: [""],
    medications: [],
    customMedications: [""],
  });

  const scrollToInput = (ref) => {
    if (!ref?.current || !scrollRef.current) return;
    ref.current.measureLayout(
      scrollRef.current,
      (x, y) => {
        scrollRef.current.scrollTo({
          y: Math.max(0, y - spacing.xl),
          animated: true,
        });
      },
      () => {}
    );
  };

  const applyDOB = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    const dobStr = `${y}-${m}-${d}`;

    const today = new Date();
    let age = today.getFullYear() - dateObj.getFullYear();
    const monthDiff = today.getMonth() - dateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < dateObj.getDate())
    ) {
      age--;
    }

    setNewPatient((p) => ({
      ...p,
      dob: dobStr,
      age: age.toString(),
    }));
  };

  const handleDOBChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      // يمنع اللوب: أي change على أندرويد لازم يسكر الـ picker فوراً
      if (event?.type === "set" && selectedDate) {
        applyDOB(selectedDate);
      }
      setShowDOBPicker(false);
      return;
    }

    if (selectedDate) {
      setTempDOB(selectedDate);
    }
  };

  const saveDOB = () => {
    applyDOB(tempDOB);
    setShowDOBPicker(false);
  };

  const goNext = () => {
    const { fullName, idNumber, phone, address, dob, gender, clinic } =
      newPatient;
    if (
      ![fullName, idNumber, phone, address, dob, gender, clinic].every(Boolean)
    ) {
      return Alert.alert("تحذير", "يرجى تعبئة جميع الحقول قبل المتابعة.");
    }
    navigation.navigate("AddPatientStep2", { newPatient });
  };

  return (
    <KeyboardAvoidingView
      style={styles.safe}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>البيانات الأساسية</Text>

        <View style={styles.card}>
          {/* الاسم */}
          <TextInput
            ref={fullNameRef}
            style={[styles.input, focused === "fullName" && styles.inputFocused]}
            placeholder="الاسم الرباعي"
            placeholderTextColor={colors.textMuted}
            value={newPatient.fullName}
            onChangeText={(t) => setNewPatient({ ...newPatient, fullName: t })}
            textAlign="right"
            onFocus={() => {
              setFocused("fullName");
              scrollToInput(fullNameRef);
            }}
            onBlur={() => setFocused(null)}
            returnKeyType="next"
            onSubmitEditing={() => idNumberRef.current?.focus()}
          />

          {/* الهوية */}
          <TextInput
            ref={idNumberRef}
            style={[styles.input, focused === "idNumber" && styles.inputFocused]}
            placeholder="رقم الهوية"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={newPatient.idNumber}
            onChangeText={(t) => setNewPatient({ ...newPatient, idNumber: t })}
            textAlign="right"
            onFocus={() => {
              setFocused("idNumber");
              scrollToInput(idNumberRef);
            }}
            onBlur={() => setFocused(null)}
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />

          {/* الجنس */}
          <Text style={styles.label}>الجنس</Text>
          <View style={styles.row}>
            {["ذكر", "أنثى"].map((g) => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.genderBtn,
                  newPatient.gender === g && styles.genderActive,
                ]}
                onPress={() => setNewPatient({ ...newPatient, gender: g })}
                activeOpacity={0.85}
              >
                <Text
                  style={
                    newPatient.gender === g
                      ? styles.genderTextActive
                      : styles.genderText
                  }
                >
                  {g}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* الهاتف */}
          <TextInput
            ref={phoneRef}
            style={[styles.input, focused === "phone" && styles.inputFocused]}
            placeholder="رقم الهاتف"
            placeholderTextColor={colors.textMuted}
            keyboardType="phone-pad"
            value={newPatient.phone}
            onChangeText={(t) => setNewPatient({ ...newPatient, phone: t })}
            textAlign="right"
            onFocus={() => {
              setFocused("phone");
              scrollToInput(phoneRef);
            }}
            onBlur={() => setFocused(null)}
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
          />

          {/* العنوان */}
          <TextInput
            ref={addressRef}
            style={[styles.input, focused === "address" && styles.inputFocused]}
            placeholder="العنوان / المنطقة"
            placeholderTextColor={colors.textMuted}
            value={newPatient.address}
            onChangeText={(t) => setNewPatient({ ...newPatient, address: t })}
            textAlign="right"
            onFocus={() => {
              setFocused("address");
              scrollToInput(addressRef);
            }}
            onBlur={() => setFocused(null)}
            returnKeyType="done"
          />

          {/* تاريخ الميلاد */}
          <TouchableOpacity
            style={[
              styles.input,
              styles.dobInput,
              focused === "dob" && styles.inputFocused,
            ]}
            onPress={() => {
              setFocused("dob");
              if (!showDOBPicker) setShowDOBPicker(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={newPatient.dob ? styles.dobText : styles.dobPlaceholder}>
              {newPatient.dob || "اختر تاريخ الميلاد"}
            </Text>
          </TouchableOpacity>

          {showDOBPicker && (
            <View style={styles.pickerWrap}>
              <DateTimePicker
                value={tempDOB}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={handleDOBChange}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity onPress={saveDOB} style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>تم</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* العمر */}
          <TextInput
            ref={ageRef}
            style={[styles.input, styles.disabledInput]}
            placeholder="العمر"
            placeholderTextColor={colors.textMuted}
            editable={false}
            value={newPatient.age}
            textAlign="right"
            onFocus={() => scrollToInput(ageRef)}
          />

          {/* العيادة */}
          <TextInput
            ref={clinicRef}
            style={[styles.input, focused === "clinic" && styles.inputFocused]}
            placeholder="اسم العيادة"
            placeholderTextColor={colors.textMuted}
            value={newPatient.clinic}
            onChangeText={(t) => setNewPatient({ ...newPatient, clinic: t })}
            textAlign="right"
            onFocus={() => {
              setFocused("clinic");
              scrollToInput(clinicRef);
            }}
            onBlur={() => setFocused(null)}
            returnKeyType="done"
          />
        </View>

        <View style={styles.singleBtnWrapper}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={goNext}
            activeOpacity={0.9}
          >
            <Text style={styles.nextButtonText}>التالي</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  sectionTitle: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  // ✅ كارد مرتب للحقول
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: Platform.OS === "ios" ? spacing.md : spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.sm + 4,
    backgroundColor: colors.background,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
    minHeight: 48,
  },
  inputFocused: {
    borderColor: colors.primary, // نفس ألوان الثيم
    borderWidth: 1.5,
    ...shadows.medium,
  },
  disabledInput: {
    opacity: 0.85,
  },

  dobInput: {
    justifyContent: "center",
  },
  dobText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },
  dobPlaceholder: {
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },

  label: {
    fontWeight: "600",
    marginBottom: spacing.xs,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },
  row: {
    flexDirection: "row-reverse",
    marginBottom: spacing.sm + 6,
  },
  genderBtn: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.pill,
    marginLeft: spacing.sm,
    backgroundColor: colors.background,
    minWidth: 90,
    alignItems: "center",
  },
  genderActive: {
    backgroundColor: colors.buttonPrimary,
    borderColor: colors.buttonPrimary,
  },
  genderText: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },
  genderTextActive: {
    color: colors.buttonPrimaryText,
    fontWeight: "700",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },

  pickerWrap: {
    marginTop: -spacing.xs,
    marginBottom: spacing.md,
    borderRadius: radii.md,
    overflow: "hidden",
  },

  singleBtnWrapper: {
    marginTop: spacing.lg,
  },
  nextButton: {
    backgroundColor: colors.buttonInfo,
    paddingVertical: spacing.md + 2,
    borderRadius: radii.md,
    ...shadows.medium,
  },
  nextButtonText: {
    color: colors.buttonInfoText,
    fontSize: typography.bodyLg,
    textAlign: "center",
    fontWeight: "700",
    fontFamily: typography.fontFamily,
  },
  confirmBtn: {
    backgroundColor: colors.buttonInfo,
    padding: spacing.md - 2,
    borderRadius: radii.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  confirmText: {
    color: colors.buttonInfoText,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },
});
