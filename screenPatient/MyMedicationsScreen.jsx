// screenPatient/MyMedicationsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function MyMedicationsScreen() {
  const route = useRoute();

  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStoredPatientId = async () => {
    const keys = ["patient_id", "patientId", "user_id", "userId", "id"];
    for (const k of keys) {
      const v = await AsyncStorage.getItem(k);
      if (v) return v;
    }
    return null;
  };

  const loadMeds = async () => {
    try {
      setLoading(true);

      let patientId = route.params?.patientId || null;
      if (!patientId) patientId = await getStoredPatientId();

      if (!patientId) {
        setMedications([]);
        return;
      }

      const url = AbedEndPoint.patientMedsByPatient(patientId);
      const res = await fetch(url, { headers: { Accept: "application/json" } });
      const data = await res.json();

      const normalized = Array.isArray(data)
        ? data.map((x) => ({
            id: x.id,
            name: x.name || x.med_name || "دواء",
            dosage: x.dosage || x.dose_text || "",
            frequency: x.frequency || x.frequency_text || "",
            doseTime:
              x.doseTime ||
              (x.interval_hours ? `كل ${x.interval_hours} ساعة` : "") ||
              "",
            timeToTake: x.timeToTake || "",
            additionalInstructions:
              x.additionalInstructions || x.instructions || "",
          }))
        : [];

      setMedications(normalized);
    } catch (e) {
      setMedications([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeds();
  }, []);

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medCard}>
      <Text style={styles.medName}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Ionicons name="flask-outline" size={20} color={colors.accent} />
        <Text style={styles.value}>الجرعة: {item.dosage || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="repeat-outline" size={20} color={colors.accent} />
        <Text style={styles.value}>التكرار: {item.frequency || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color={colors.accent} />
        <Text style={styles.value}>وقت الجرعة: {item.doseTime || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="alarm-outline" size={20} color={colors.accent} />
        <Text style={styles.value}>
          الساعة المخصصة: {item.timeToTake || "-"}
        </Text>
      </View>

      {item.additionalInstructions ? (
        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.accent}
          />
          <Text style={styles.value}>
            تعليمات: {item.additionalInstructions}
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />

      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary}
            style={{ marginTop: spacing.xl }}
          />
        ) : (
          <FlatList
            data={medications}
            keyExtractor={(item, idx) =>
              item.id ? String(item.id) : String(idx)
            }
            renderItem={renderMedicationItem}
            contentContainerStyle={styles.medList}
            ListHeaderComponent={
              medications.length === 0 ? (
                <Text style={styles.noMedsText}>لا توجد أدوية لعرضها</Text>
              ) : (
                <Text style={styles.countText}>
                  عدد الأدوية: {medications.length}
                </Text>
              )
            }
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.xl,
    paddingTop:
      Platform.OS === "android"
        ? StatusBar.currentHeight + spacing.sm
        : spacing.sm,
  },
  noMedsText: {
    textAlign: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.textMuted,
    fontSize: typography.bodyLg,
    writingDirection: "rtl",
    fontFamily: typography.fontFamily,
  },
  countText: {
    textAlign: "center",
    marginBottom: spacing.sm,
    color: colors.textSecondary,
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
  },
  medList: {
    paddingBottom: 100,
    paddingTop: spacing.sm,
  },
  medCard: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
    borderLeftWidth: 6,
    borderLeftColor: colors.accent,
    ...shadows.light,
    writingDirection: "rtl",
  },
  medName: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  value: {
    flex: 1,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    marginLeft: spacing.sm,
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },
});
