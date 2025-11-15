import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";

const COLORS = {
  primary: "#00b29c",
  bg: "#f5f7f8",
  card: "#ffffff",
  text: "#1f2937",
  mutetxt: "#6b7280",
  border: "#e5e7eb",
};

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

export default function AddPatientStep3Screen() {
  const route = useRoute();
  const navigation = useNavigation();
  const passedPatient = route.params?.newPatient;

  const [searchMedication, setSearchMedication] = useState("");
  const [newPatient, setNewPatient] = useState(
    passedPatient || {
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
    }
  );

  const [doctorId, setDoctorId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const id = await AsyncStorage.getItem("doctor_id");
        if (id) setDoctorId(parseInt(id, 10));
      } catch (e) {
        console.log("Error loading doctor_id", e);
      }
    };
    loadDoctor();
  }, []);

  const filteredMedications = commonMedications.filter((m) =>
    m.toLowerCase().includes(searchMedication.toLowerCase())
  );

  const toggleMedication = (med) => {
    setNewPatient((p) => {
      const list = p.medications || [];
      return {
        ...p,
        medications: list.includes(med)
          ? list.filter((x) => x !== med)
          : [...list, med],
      };
    });
  };

  const updateCustomMed = (index, value) => {
    let updated = [...(newPatient.customMedications || [""])];
    const lastIndex = updated.length - 1;
    if (index === lastIndex) {
      if (value) {
        updated[index] = value;
        updated.push("");
      } else {
        if (updated.length > 1) updated.pop();
        else updated[index] = "";
      }
    } else {
      updated[index] = value;
    }
    setNewPatient({ ...newPatient, customMedications: updated });
  };

  const handleSave = async () => {
    const { fullName, idNumber, phone, address, dob, gender, clinic } =
      newPatient;
    if (
      ![fullName, idNumber, phone, address, dob, gender, clinic].every(Boolean)
    ) {
      return Alert.alert("تحذير", "هناك بيانات أساسية ناقصة.");
    }

    const finalDiseases = [
      ...(newPatient.diseases || []),
      ...(newPatient.customDiseases || []).filter(Boolean),
    ];
    const finalMedications = [
      ...(newPatient.medications || []),
      ...(newPatient.customMedications || []).filter(Boolean),
    ];

    try {
      const docId = doctorId || (await AsyncStorage.getItem("doctor_id"));
      if (!docId) {
        return Alert.alert(
          "خطأ",
          "لا يوجد doctor_id مخزّن. تأكد من الحساب أو أعد تسجيل الدخول."
        );
      }

      const body = {
        full_name: fullName,
        national_id: idNumber,
        phone,
        address,
        birth_date: dob,
        clinic_name: clinic || "Main Clinic",
        username: idNumber,
        password: "1234",
        diseases: finalDiseases,
        medications: finalMedications,
      };

      setSaving(true);
      const res = await fetch(AbedEndPoint.patientCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Doctor-Id": String(docId),
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("save failed");

      await res.json();

      Alert.alert("تم", "تمت إضافة المريض بنجاح.");
      navigation.navigate("MainTabs", {
        screen: "المرضى",
        params: { screen: "Patients" },
      });
    } catch (e) {
      console.log("Error saving patient", e);
      Alert.alert("خطأ", "تعذر حفظ المريض. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>الأدوية</Text>

        <TextInput
          style={styles.input}
          placeholder="ابحث عن دواء..."
          value={searchMedication}
          onChangeText={setSearchMedication}
        />

        {filteredMedications.map((med) => (
          <View style={styles.switchRow} key={med}>
            <Text style={styles.switchLabel}>{med}</Text>
            <Switch
              value={(newPatient.medications || []).includes(med)}
              onValueChange={() => toggleMedication(med)}
            />
          </View>
        ))}

        {(newPatient.customMedications || [""]).map((m, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`دواء آخر ${index + 1}`}
            value={m}
            onChangeText={(t) => updateCustomMed(index, t)}
          />
        ))}

        {/* ✅ زر واحد للحفظ – الرجوع من سهم الهيدر فقط */}
        <View style={styles.singleBtnWrapper}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>حفظ المريض</Text>
            )}
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
    marginBottom: 10,
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
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  switchLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: "right",
    marginLeft: 10,
  },
  singleBtnWrapper: {
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },
});
