import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";

const COLORS = {
  primary: "#00b29c",
  bg: "#f5f7f8",
  card: "#ffffff",
  text: "#1f2937",
  mutetxt: "#6b7280",
  border: "#e5e7eb",
};

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

export default function AddPatientStep2Screen() {
  const route = useRoute();
  const navigation = useNavigation();
  const passedPatient = route.params?.newPatient;

  const [searchDisease, setSearchDisease] = useState("");
  const [newPatient, setNewPatient] = useState(
    passedPatient || {
      diseases: [],
      customDiseases: [""],
      medications: [],
      customMedications: [""],
    }
  );

  const filteredDiseases = commonDiseases.filter((d) =>
    d.toLowerCase().includes(searchDisease.toLowerCase())
  );

  const toggleDisease = (disease) => {
    setNewPatient((p) => {
      const list = p.diseases || [];
      return {
        ...p,
        diseases: list.includes(disease)
          ? list.filter((x) => x !== disease)
          : [...list, disease],
      };
    });
  };

  const updateCustomDisease = (index, value) => {
    let updated = [...(newPatient.customDiseases || [""])];
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
    setNewPatient({ ...newPatient, customDiseases: updated });
  };

  const goNext = () => {
    navigation.navigate("AddPatientStep3", { newPatient });
  };

  return (
    <View style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.sectionTitle}>الأمراض</Text>

        <TextInput
          style={styles.input}
          placeholder="ابحث عن مرض..."
          value={searchDisease}
          onChangeText={setSearchDisease}
        />

        {filteredDiseases.map((disease) => (
          <View style={styles.switchRow} key={disease}>
            <Text style={styles.switchLabel}>{disease}</Text>
            <Switch
              value={(newPatient.diseases || []).includes(disease)}
              onValueChange={() => toggleDisease(disease)}
            />
          </View>
        ))}

        {(newPatient.customDiseases || [""]).map((d, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`مرض آخر ${index + 1}`}
            value={d}
            onChangeText={(t) => updateCustomDisease(index, t)}
          />
        ))}

        {/* ✅ زر واحد (التالي) – الرجوع من سهم الهيدر */}
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
});
