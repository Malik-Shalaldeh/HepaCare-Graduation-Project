// AddPatientStep2Screen
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
import { colors, spacing, radii, typography, shadows } from "../style/theme";

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
          placeholderTextColor={colors.textMuted}
          value={searchDisease}
          onChangeText={setSearchDisease}
          textAlign="right"
        />

        {filteredDiseases.map((disease) => (
          <View style={styles.switchRow} key={disease}>
            <Text style={styles.switchLabel}>{disease}</Text>
            <Switch
              value={(newPatient.diseases || []).includes(disease)}
              onValueChange={() => toggleDisease(disease)}
              trackColor={{
                false: colors.border,
                true: colors.accent,
              }}
              thumbColor={
                Platform.OS === "android" ? colors.primary : undefined
              }
            />
          </View>
        ))}

        {(newPatient.customDiseases || [""]).map((d, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`مرض آخر ${index + 1}`}
            placeholderTextColor={colors.textMuted}
            value={d}
            onChangeText={(t) => updateCustomDisease(index, t)}
            textAlign="right"
          />
        ))}

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
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
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
  singleBtnWrapper: {
    marginTop: spacing.lg,
  },
  nextButton: {
    backgroundColor: colors.buttonInfo,
    padding: spacing.md,
    borderRadius: radii.sm,
    ...shadows.medium,
  },
  nextButtonText: {
    color: colors.buttonInfoText,
    fontSize: typography.bodyLg,
    textAlign: "center",
    fontWeight: "600",
    fontFamily: typography.fontFamily,
  },
});
