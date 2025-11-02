import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const API = "http://192.168.1.120:8000";

const commonDiseases = [
  "Diabetes",
  "High Blood Pressure",
  "Heart Diseases",
  "Asthma",
  "Hepatitis",
  "Cholesterol",
  "Cancer",
  "Psoriasis",
  "Epilepsy",
  "Tuberculosis",
  "Chronic Kidney Disease",
];

const commonMedications = [
  "Insulin",
  "Paracetamol",
  "Metformin",
  "Amlodipine",
  "Blood Pressure Medication",
  "Cholesterol Medication",
  "Tamoxifen",
  "Neurontin",
  "Valium",
  "Kidney Medications",
];

export default function AddPatientsComponent() {
  const navigation = useNavigation();
  const [step, setStep] = useState(1);
  const [searchDisease, setSearchDisease] = useState("");
  const [searchMedication, setSearchMedication] = useState("");
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

  const [showDOBPicker, setShowDOBPicker] = useState(false);
  const [tempDOB, setTempDOB] = useState(new Date());

  useEffect(() => {
    if (newPatient.dob) {
      const d = new Date(newPatient.dob);
      const t = new Date();
      let age = t.getFullYear() - d.getFullYear();
      const m = t.getMonth() - d.getMonth();
      if (m < 0 || (m === 0 && t.getDate() < d.getDate())) age--;
      setNewPatient((p) => ({ ...p, age: age.toString() }));
    }
  }, [newPatient.dob]);

  const saveDOB = () => {
    const y = tempDOB.getFullYear(),
      m = String(tempDOB.getMonth() + 1).padStart(2, "0"),
      d = String(tempDOB.getDate()).padStart(2, "0");
    setNewPatient((p) => ({ ...p, dob: `${y}-${m}-${d}` }));
    setShowDOBPicker(false);
  };

  const toggleItem = (listName, item) => {
    setNewPatient((p) => {
      const list = p[listName];
      return {
        ...p,
        [listName]: list.includes(item)
          ? list.filter((x) => x !== item)
          : [...list, item],
      };
    });
  };

  // === ربط الحفظ بالباك-إند (بدون تعديل الستايل) ===
  const handleSave = async () => {
    const { fullName, idNumber, phone, address, dob, gender, clinic } =
      newPatient;
    if (
      ![fullName, idNumber, phone, address, dob, gender, clinic].every(Boolean)
    ) {
      return Alert.alert("تحذير", "يرجى تعبئة جميع الحقول الأساسية.");
    }

    const finalDiseases = [
      ...newPatient.diseases,
      ...newPatient.customDiseases.filter(Boolean),
    ];
    const finalMedications = [
      ...newPatient.medications,
      ...newPatient.customMedications.filter(Boolean),
    ];

    try {
      const doctorId = await AsyncStorage.getItem("doctor_id");
      if (!doctorId) {
        return Alert.alert(
          "خطأ",
          "لا يوجد doctor_id مخزّن. تأكد أن الحساب طبيب أو أعد تسجيل الدخول."
        );
      }

      const body = {
        full_name: fullName,
        national_id: idNumber,
        phone,
        address,
        birth_date: dob,
        clinic_name: clinic || "Main Clinic",
        // ⛔ تم حذف doctor_id من الـ body — الإرسال عبر الهيدر فقط
        username: idNumber,
        password: "1234",
        diseases: finalDiseases,
        medications: finalMedications,
      };

      const res = await fetch(`${API}/patient/patients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Doctor-Id": String(doctorId), // <-- نرسل الدكتور من AsyncStorage
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("save failed");

      const patientData = await res.json();
      const patientId = patientData.patient_id || patientData.id;

      Alert.alert("تم", "تمت إضافة المريض بنجاح.");
      setNewPatient({
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
      setStep(1);
      navigation.navigate("المرضى");
    } catch (e) {
      Alert.alert("خطأ", "تعذر حفظ المريض. حاول مرة أخرى.");
    }
  };

  const filteredDiseases = commonDiseases.filter((d) =>
    d.toLowerCase().includes(searchDisease.toLowerCase())
  );
  const filteredMedications = commonMedications.filter((m) =>
    m.toLowerCase().includes(searchMedication.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        overScrollMode="never"
        bounces={false}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>إضافة مريض جديد</Text>

        {step === 1 && (
          <>
            {/* ====== بيانات أساسية ====== */}
            <TextInput
              style={styles.input}
              placeholder="الاسم الرباعي"
              value={newPatient.fullName}
              onChangeText={(t) =>
                setNewPatient({ ...newPatient, fullName: t })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="رقم الهوية"
              keyboardType="numeric"
              value={newPatient.idNumber}
              onChangeText={(t) =>
                setNewPatient({ ...newPatient, idNumber: t })
              }
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
              <Text>{newPatient.dob || "اختر تاريخ الميلاد"}</Text>
            </TouchableOpacity>
            {showDOBPicker && (
              <>
                <DateTimePicker
                  value={tempDOB}
                  mode="date"
                  display="default"
                  onChange={(e, d) => d && setTempDOB(d)}
                />
                <TouchableOpacity onPress={saveDOB} style={styles.confirmBtn}>
                  <Text style={styles.confirmText}>تم</Text>
                </TouchableOpacity>
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
            <View style={styles.rowBetween}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.navigate("المرضى")}
              >
                <Text style={styles.cancelText}>إلغاء</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => {
                  const {
                    fullName,
                    idNumber,
                    phone,
                    address,
                    dob,
                    gender,
                    clinic,
                  } = newPatient;
                  if (
                    ![
                      fullName,
                      idNumber,
                      phone,
                      address,
                      dob,
                      gender,
                      clinic,
                    ].every(Boolean)
                  ) {
                    return Alert.alert(
                      "تحذير",
                      "يرجى تعبئة جميع الحقول قبل المتابعة."
                    );
                  }
                  setStep(2);
                }}
              >
                <Text style={styles.nextButtonText}>التالي</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 2 && (
          <>
            {/* ====== اختيار الأمراض ====== */}
            <TextInput
              style={styles.input}
              placeholder="ابحث عن مرض..."
              value={searchDisease}
              onChangeText={setSearchDisease}
            />
            {filteredDiseases.map((disease) => (
              <View className="switchRow" style={styles.switchRow} key={disease}>
                <Text>{disease}</Text>
                <Switch
                  value={newPatient.diseases.includes(disease)}
                  onValueChange={() => toggleItem("diseases", disease)}
                />
              </View>
            ))}

            {newPatient.customDiseases.map((d, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`مرض آخر ${index + 1}`}
                value={d}
                onChangeText={(t) => {
                  let updated = [...newPatient.customDiseases];
                  const lastIndex = updated.length - 1;
                  if (index === lastIndex) {
                    if (t) {
                      updated[index] = t;
                      updated.push("");
                    } else {
                      if (updated.length > 1) updated.pop();
                      else updated[index] = "";
                    }
                  } else {
                    updated[index] = t;
                  }
                  setNewPatient({ ...newPatient, customDiseases: updated });
                }}
              />
            ))}

            <View style={styles.rowBetween}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setStep(1)}
              >
                <Text style={styles.cancelText}>رجوع</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.nextButton}
                onPress={() => setStep(3)}
              >
                <Text style={styles.nextButtonText}>التالي</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {step === 3 && (
          <>
            {/* ====== اختيار الأدوية ====== */}
            <TextInput
              style={styles.input}
              placeholder="ابحث عن دواء..."
              value={searchMedication}
              onChangeText={setSearchMedication}
            />
            {filteredMedications.map((med) => (
              <View className="switchRow" style={styles.switchRow} key={med}>
                <Text>{med}</Text>
                <Switch
                  value={newPatient.medications.includes(med)}
                  onValueChange={() => toggleItem("medications", med)}
                />
              </View>
            ))}

            {newPatient.customMedications.map((m, index) => (
              <TextInput
                key={index}
                style={styles.input}
                placeholder={`دواء آخر ${index + 1}`}
                value={m}
                onChangeText={(t) => {
                  let updated = [...newPatient.customMedications];
                  const lastIndex = updated.length - 1;
                  if (index === lastIndex) {
                    if (t) {
                      updated[index] = t;
                      updated.push("");
                    } else {
                      if (updated.length > 1) updated.pop();
                      else updated[index] = "";
                    }
                  } else {
                    updated[index] = t;
                  }
                  setNewPatient({
                    ...newPatient,
                    customMedications: updated,
                  });
                }}
              />
            ))}

            <View style={styles.rowBetween}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setStep(2)}
              >
                <Text style={styles.cancelText}>رجوع</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>حفظ المريض</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: Platform.OS === "android" ? 60 : 20, // مساحة أسفل المحتوى
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#FFF",
  },
  label: { fontWeight: "bold", marginBottom: 4 },
  row: { flexDirection: "row", marginBottom: 12 },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  genderBtn: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 10,
    borderRadius: 8,
  },
  genderActive: { backgroundColor: "#4CAF50", borderColor: "#4CAF50" },
  genderText: { color: "#444" },
  genderTextActive: { color: "#FFF", fontWeight: "bold" },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: "#2196F3",
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  nextButtonText: { color: "#FFF", fontSize: 16, textAlign: "center" },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginLeft: 5,
  },
  saveButtonText: { color: "#FFF", fontSize: 16, textAlign: "center" },
  cancelButton: {
    backgroundColor: "#E53935",
    padding: 14,
    borderRadius: 8,
    flex: 1,
    marginRight: 5,
  },
  cancelText: { color: "#FFF", fontSize: 16, textAlign: "center" },
  confirmBtn: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: { color: "#FFF", fontWeight: "bold" },
});
