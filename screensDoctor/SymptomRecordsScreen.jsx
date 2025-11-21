// screensDoctor/SymptomRecordsScreen.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  useRoute,
  useNavigation,
  useFocusEffect,
} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function SymptomRecordsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const patient = route.params?.patient;

  const [doctorId, setDoctorId] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const loadDoctor = async () => {
      try {
        const id = await AsyncStorage.getItem("doctor_id");
        if (mounted) setDoctorId(id ? parseInt(id, 10) : null);
      } catch (e) {
        if (mounted) setDoctorId(null);
      }
    };
    loadDoctor();
    return () => {
      mounted = false;
    };
  }, []);

  const normalizeRecords = (data) => {
    const arr = Array.isArray(data) ? data : [];
    return arr.map((item) => {
      const visitDate =
        item.visitDate ||
        item.visit_date ||
        item.test_date ||
        item.created_at ||
        item.date ||
        item.createdTime ||
        "";

      let symptomsText = "";
      const s = item.symptoms || item.symptom_names || item.symptomNames;

      if (Array.isArray(s)) {
        symptomsText = s
          .map((x) => x?.name || x?.label || x)
          .filter(Boolean)
          .join("، ");
      } else if (typeof s === "string") {
        symptomsText = s;
      }

      const notes =
        item.notes ||
        item.comment ||
        item.comments ||
        item.instructions ||
        "";

      return {
        id: item.id ?? `${visitDate}-${Math.random()}`,
        visitDate,
        symptoms: symptomsText,
        notes,
      };
    });
  };

  const loadPatientEntries = async () => {
    const pid = patient?.patientId ?? patient?.patient_id ?? patient?.id;
    if (!doctorId || !pid) {
      setRecords([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const url =
        `${AbedEndPoint.symptomEntries}` +
        `?patient_id=${encodeURIComponent(pid)}` +
        `&doctor_id=${encodeURIComponent(doctorId)}`;

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setRecords(normalizeRecords(data));
    } catch (err) {
      console.log("Error loading entries", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatientEntries();
    }, [doctorId, patient?.patientId, patient?.id])
  );

  const renderRecord = ({ item, index }) => (
    <View style={styles.recordCard}>
      <Text style={styles.recordTitle}>
        تتبع #{index + 1} - {item.visitDate || "-"}
      </Text>
      <Text style={styles.recordLabel}>الأعراض:</Text>
      <Text style={styles.recordText}>
        {item.symptoms && item.symptoms.trim() ? item.symptoms : "لا توجد أعراض"}
      </Text>

      {item.notes ? (
        <>
          <Text style={styles.recordLabel}>ملاحظات:</Text>
          <Text style={styles.recordText}>{item.notes}</Text>
        </>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.patientCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{patient?.name}</Text>
            {patient?.nationalId ? (
              <Text style={styles.patientSub}>
                الرقم الوطني: {patient.nationalId}
              </Text>
            ) : null}
          </View>
          <Ionicons
            name="person-circle-outline"
            size={36}
            color={colors.accent}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>سجل الأعراض</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("SymptomAdd", { patient })}
            activeOpacity={0.9}
          >
            <Ionicons name="add-circle" size={22} color="#fff" />
            <Text style={styles.addTxt}>تسجيل عرض</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.mutetxt}>جارٍ تحميل السجل...</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.mutetxt}>
              لا يوجد سجل لهذا المريض حتى الآن.
            </Text>
          </View>
        ) : (
          <FlatList
            data={records}
            keyExtractor={(item, i) => (item.id ? String(item.id) : String(i))}
            renderItem={renderRecord}
            contentContainerStyle={{ paddingVertical: spacing.sm }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
  },
  patientCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadows.light,
  },
  patientName: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
  },
  patientSub: {
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: "right",
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  addBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.pill,
    ...shadows.light,
  },
  addTxt: {
    color: "#fff",
    marginHorizontal: spacing.sm,
    fontWeight: "600",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mutetxt: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyMd,
  },
  recordCard: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  recordTitle: {
    fontWeight: "700",
    fontFamily: typography.fontFamily,
    fontSize: typography.bodyLg,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
    textAlign: "right",
  },
  recordLabel: {
    fontWeight: "600",
    fontFamily: typography.fontFamily,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    color: colors.textPrimary,
    textAlign: "right",
    fontSize: typography.bodyMd,
  },
  recordText: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: "right",
    lineHeight: typography.lineHeightNormal,
  },
});
