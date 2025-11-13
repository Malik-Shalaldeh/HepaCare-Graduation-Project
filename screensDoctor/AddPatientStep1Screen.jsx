import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const COLORS = {
  primary: "#00b29c",
  bg: "#f5f7f8",
  card: "#ffffff",
  text: "#1f2937",
  mutetxt: "#6b7280",
  border: "#e5e7eb",
};

export default function AddPatientStep1Screen() {
  const navigation = useNavigation();

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

  const applyDOB = (dateObj) => {
    // تنسيق التاريخ
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    const dobStr = `${y}-${m}-${d}`;

    // حساب العمر
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
    // ANDROID
    if (Platform.OS === "android") {
      if (event.type === "set" && selectedDate) {
        // المستخدم اختار تاريخ و ضغط OK
        applyDOB(selectedDate);
      }
      // بأي حالة (set أو dismissed) نسكر البيكر
      setShowDOBPicker(false);
      return;
    }

    // iOS: نحدّث التاريخ المؤقت فقط، والحفظ من زر "تم"
    if (selectedDate) {
      setTempDOB(selectedDate);
    }
  };

  // يستخدم فقط في iOS
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
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>البيانات الأساسية</Text>

        <TextInput
          style={styles.input}
          placeholder="الاسم الرباعي"
          value={newPatient.fullName}
          onChangeText={(t) => setNewPatient({ ...newPatient, fullName: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="رقم الهوية"
          keyboardType="numeric"
          value={newPatient.idNumber}
          onChangeText={(t) => setNewPatient({ ...newPatient, idNumber: t })}
        />

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

        <TextInput
          style={styles.input}
          placeholder="رقم الهاتف"
          keyboardType="phone-pad"
          value={newPatient.phone}
          onChangeText={(t) => setNewPatient({ ...newPatient, phone: t })}
        />
        <TextInput
          style={styles.input}
          placeholder="العنوان / المنطقة"
          value={newPatient.address}
          onChangeText={(t) => setNewPatient({ ...newPatient, address: t })}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDOBPicker(true)}
        >
          <Text style={newPatient.dob ? styles.dobText : styles.dobPlaceholder}>
            {newPatient.dob || "اختر تاريخ الميلاد"}
          </Text>
        </TouchableOpacity>

        {showDOBPicker && (
          <>
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
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="العمر"
          editable={false}
          value={newPatient.age}
        />
        <TextInput
          style={styles.input}
          placeholder="اسم العيادة"
          value={newPatient.clinic}
          onChangeText={(t) => setNewPatient({ ...newPatient, clinic: t })}
        />

        <View style={styles.singleBtnWrapper}>
          <TouchableOpacity style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>التالي</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 16,
    paddingBottom: Platform.OS === "android" ? 24 : 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 12,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: COLORS.card,
    fontSize: 14,
    textAlign: "right",
  },
  dobText: { color: COLORS.text },
  dobPlaceholder: { color: COLORS.mutetxt },
  label: {
    fontWeight: "600",
    marginBottom: 4,
    color: COLORS.text,
    textAlign: "right",
  },
  row: { flexDirection: "row-reverse", marginBottom: 10 },
  genderBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    marginLeft: 8,
  },
  genderActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: { color: COLORS.text },
  genderTextActive: { color: "#fff", fontWeight: "700" },
  singleBtnWrapper: {
    marginTop: 16,
  },
  nextButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#FFF",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },
  confirmBtn: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 6,
  },
  confirmText: { color: "#FFF", fontWeight: "bold" },
});
