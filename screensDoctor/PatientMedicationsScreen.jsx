// screensDoctor/PatientMedicationsScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function PatientMedicationsScreen({ route, navigation }) {
  const { patientId, patientName } = route.params;
  const [doctorId, setDoctorId] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const stored = await AsyncStorage.getItem("doctor_id");
        setDoctorId(stored ? parseInt(stored, 10) : 420094999);
      } catch {
        setDoctorId(420094999);
      }
    };
    loadDoctor();
  }, []);

  const fetchMeds = async () => {
    if (!doctorId || !patientId) return;
    setLoading(true);
    try {
      const url =
        `${AbedEndPoint.patientMedsList}` +
        `?patient_id=${encodeURIComponent(patientId)}` +
        `&doctor_id=${encodeURIComponent(doctorId)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("err");
      const data = await res.json();
      const mapped = (Array.isArray(data) ? data : []).map((item) => ({
        id: item.id,
        patientName: item.patient_name,
        patientId: item.patient_id,
        name: item.medication_name,
        medicationId: item.medication_id,
        dosage: item.dose_text || "",
        frequency: item.frequency_text || "",
        doseTime: item.dose_time || "",
        timeToTake: item.dose_time || "",
        additionalInstructions: item.instructions || "",
      }));
      setMedications(mapped);
    } catch {
      setMedications([]);
      Alert.alert("خطأ", "تعذر جلب أدوية المريض.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMeds();
    }, [doctorId, patientId])
  );

  const goToAdd = () => {
    navigation.navigate("MedicationForm", {
      mode: "add",
      patientId,
      patientName,
    });
  };
  const goToEdit = (item) => {
    navigation.navigate("MedicationForm", {
      mode: "edit",
      patientId,
      patientName,
      medication: item,
    });
  };
  const deleteMedication = async (med) => {
    if (!doctorId) return Alert.alert("خطأ", "تعذر تحديد رقم الطبيب.");
    try {
      const url = `${AbedEndPoint.patientMedicationById(
        med.id
      )}?doctor_id=${encodeURIComponent(doctorId)}`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setMedications((prev) => prev.filter((m) => m.id !== med.id));
    } catch {
      Alert.alert("خطأ", "تعذر حذف الدواء.");
    }
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medItem}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.medName, styles.rtlText]} numberOfLines={2}>
          {item.name || item.medication_name}
        </Text>

        <View style={styles.infoRow}>
          <Ionicons name="flask-outline" size={16} color={colors.accent} />
          <Text style={[styles.infoText, styles.rtlText]}>
            الجرعة: {item.dosage || "-"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="repeat-outline" size={16} color={colors.accent} />
          <Text style={[styles.infoText, styles.rtlText]}>
            التكرار: {item.frequency || "-"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={colors.accent} />
          <Text style={[styles.infoText, styles.rtlText]}>
            وقت الجرعة: {item.doseTime || "-"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons name="alarm-outline" size={16} color={colors.accent} />
          <Text style={[styles.infoText, styles.rtlText]}>
            الساعة المخصصة: {item.timeToTake || "-"}
          </Text>
        </View>

        {item.additionalInstructions ? (
          <View style={styles.infoRow}>
            <Ionicons
              name="information-circle-outline"
              size={16}
              color={colors.accent}
            />
            <Text style={[styles.infoText, styles.rtlText]}>
              تعليمات: {item.additionalInstructions}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.medActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => goToEdit(item)}
          activeOpacity={0.9}
        >
          <Ionicons name="create-outline" size={20} color={colors.buttonPrimaryText} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => deleteMedication(item)}
          activeOpacity={0.9}
        >
          <Ionicons name="trash-outline" size={20} color={colors.buttonDangerText} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={[styles.subtitle, styles.rtlText]}>
          متابعات {patientName}
        </Text>

        <TouchableOpacity style={styles.addButton} onPress={goToAdd} activeOpacity={0.9}>
          <Ionicons name="add-circle" size={24} color={colors.buttonSuccessText} />
          <Text style={styles.addButtonText}>جــدول دواء</Text>
        </TouchableOpacity>

        {loading ? (
          <Text style={[styles.noMedsText, styles.rtlText]}>
            جاري تحميل الأدوية...
          </Text>
        ) : medications.length === 0 ? (
          <Text style={[styles.noMedsText, styles.rtlText]}>
            لا توجد أدوية لهذا المريض
          </Text>
        ) : (
          <FlatList
            data={medications}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderMedicationItem}
            contentContainerStyle={{ paddingBottom: spacing.xxl + 40 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundLight },

  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm + 4,
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  subtitle: {
    fontSize: typography.headingSm,
    fontWeight: "bold",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily,
  },

  noMedsText: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.buttonSuccess,
    paddingVertical: Platform.select({ ios: spacing.md, android: spacing.sm + 2 }),
    paddingHorizontal: spacing.md,
    borderRadius: radii.sm,
    ...shadows.medium,
    marginBottom: spacing.sm + 2,
    alignSelf: "flex-start",
  },

  addButtonText: {
    color: colors.buttonSuccessText,
    fontSize: typography.bodyLg,
    fontWeight: "700",
    marginLeft: spacing.xs + 2,
    fontFamily: typography.fontFamily,
  },

  medItem: {
    flexDirection: "row-reverse",
    backgroundColor: colors.background,
    padding: Platform.select({ ios: spacing.lg, android: spacing.md + 2 }),
    borderRadius: radii.md,
    marginVertical: spacing.xs + 2,
    borderLeftWidth: 5,
    borderLeftColor: colors.accent,
    ...shadows.light,
  },

  medName: {
    fontSize: typography.bodyLg,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    fontFamily: typography.fontFamily,
  },

  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: spacing.xs + 1,
    gap: spacing.xs + 2,
  },

  infoText: {
    fontSize: typography.bodyMd,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily,
    flex: 1,
  },

  medActions: {
    justifyContent: "space-between",
    marginRight: spacing.sm,
  },

  actionBtn: {
    padding: spacing.sm - 2,
    borderRadius: radii.sm - 2,
    marginVertical: spacing.xs,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.light,
  },

  editBtn: { backgroundColor: colors.buttonPrimary },
  deleteBtn: { backgroundColor: colors.buttonDanger },
});
