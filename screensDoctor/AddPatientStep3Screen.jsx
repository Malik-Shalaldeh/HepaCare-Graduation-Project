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
import { colors, spacing, radii, typography, shadows } from "../style/theme";

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
      cityId: null,
      cityName: "",
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
    const { fullName, idNumber, phone, dob, gender, clinic, cityId } =
      newPatient;

    if (![fullName, idNumber, phone, dob, gender, cityId].every(Boolean)) {
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
        return Alert.alert("خطأ", "لا يوجد doctor_id مخزّن. أعد تسجيل الدخول.");
      }

      const body = {
        full_name: fullName,
        national_id: idNumber,
        phone,
        birth_date: dob,

        clinic_name: clinic || null,
        city_id: cityId,

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

      const data = await res.json().catch(() => ({}));

      // ✅ تعديل مهم: لو الحساب موجود (409) اعرض رسالة واضحة للمستخدم
      if (!res.ok) {
        if (res.status === 409) {
          return Alert.alert(
            "تنبيه",
            data?.detail || "الحساب مسجل بالنظام مسبقاً."
          );
        }

        console.log("Save patient error:", data);
        throw new Error(data?.detail || "save failed");
      }

      Alert.alert("تم", "تمت إضافة المريض بنجاح.");
      navigation.navigate("المرضى");
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
          placeholderTextColor={colors.textMuted}
          value={searchMedication}
          onChangeText={setSearchMedication}
          textAlign="right"
        />

        {filteredMedications.map((med) => (
          <View style={styles.switchRow} key={med}>
            <Text style={styles.switchLabel}>{med}</Text>
            <Switch
              value={(newPatient.medications || []).includes(med)}
              onValueChange={() => toggleMedication(med)}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={
                Platform.OS === "android" ? colors.primary : undefined
              }
            />
          </View>
        ))}

        {(newPatient.customMedications || [""]).map((m, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`دواء آخر ${index + 1}`}
            placeholderTextColor={colors.textMuted}
            value={m}
            onChangeText={(t) => updateCustomMed(index, t)}
            textAlign="right"
          />
        ))}

        <View style={styles.singleBtnWrapper}>
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            disabled={saving}
            activeOpacity={0.9}
          >
            {saving ? (
              <ActivityIndicator
                size="small"
                color={colors.buttonSuccessText}
              />
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
  safe: { flex: 1, backgroundColor: colors.backgroundLight },
  container: {
    padding: spacing.lg,
    paddingBottom: Platform.OS === "android" ? spacing.xl : spacing.lg,
  },
  sectionTitle: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm + 2,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md - 2,
    borderRadius: radii.sm,
    marginBottom: spacing.sm + 2,
    backgroundColor: colors.background,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    textAlign: "right",
    fontFamily: typography.fontFamily,
    ...shadows.light,
  },
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.xs + 2,
  },
  switchLabel: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "right",
    marginLeft: spacing.sm,
    fontFamily: typography.fontFamily,
  },
  singleBtnWrapper: { marginTop: spacing.lg },
  saveButton: {
    backgroundColor: colors.buttonSuccess,
    padding: spacing.md,
    borderRadius: radii.sm,
    alignItems: "center",
    ...shadows.medium,
  },
  saveButtonText: {
    color: colors.buttonSuccessText,
    fontSize: typography.bodyLg,
    fontWeight: "600",
    fontFamily: typography.fontFamily,
  },
});
