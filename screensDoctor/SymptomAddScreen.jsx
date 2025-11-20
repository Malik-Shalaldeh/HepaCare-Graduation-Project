// screensDoctor/SymptomAddScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function SymptomAddScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const patient = route.params?.patient;

  const [doctorId, setDoctorId] = useState(null);
  const [apiSymptoms, setApiSymptoms] = useState([]);
  const [loadingSymptoms, setLoadingSymptoms] = useState(true);

  const [saving, setSaving] = useState(false);
  const [tempRecord, setTempRecord] = useState({
    patientId: patient?.patientId || null,
    symptomIds: [],
    cirrhosis: false,
    familyHCC: false,
    notes: "",
  });

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const id = await AsyncStorage.getItem("doctor_id");
        if (mounted) setDoctorId(id ? parseInt(id, 10) : null);
      } catch (e) {
        if (mounted) setDoctorId(null);
      }

      await fetchSymptoms(mounted);
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchSymptoms = async (mountedFlag = true) => {
    try {
      setLoadingSymptoms(true);
      const res = await fetch(AbedEndPoint.symptomSymptoms, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const safe = Array.isArray(data)
        ? data
            .filter((s) => s && typeof s.id !== "undefined" && s.name)
            .map((s) => ({
              id: s.id,
              name: s.name,
              code: s.code || "",
            }))
        : [];

      if (mountedFlag) setApiSymptoms(safe);
    } catch (err) {
      if (mountedFlag) setApiSymptoms([]);
      console.log("Error fetching symptoms", err);
    } finally {
      if (mountedFlag) setLoadingSymptoms(false);
    }
  };

  const generalSymptoms = apiSymptoms.filter(
    (s) => !s.code || !String(s.code).toUpperCase().startsWith("SIGN-")
  );
  const signSymptoms = apiSymptoms.filter((s) =>
    String(s.code).toUpperCase().startsWith("SIGN-")
  );

  const toggleSymptom = (id) => {
    setTempRecord((prev) => {
      const has = prev.symptomIds.includes(id);
      return {
        ...prev,
        symptomIds: has
          ? prev.symptomIds.filter((x) => x !== id)
          : [...prev.symptomIds, id],
      };
    });
  };

  const saveRecord = async () => {
    if (!patient || !doctorId) {
      Alert.alert("خطأ", "يجب اختيار مريض والتأكد من رقم الطبيب.");
      return;
    }
    if (!tempRecord.symptomIds || tempRecord.symptomIds.length === 0) {
      Alert.alert("تنبيه", "يجب اختيار عرض واحد على الأقل.");
      return;
    }

    const extraParts = [];
    extraParts.push(`Cirrhosis: ${tempRecord.cirrhosis ? "Yes" : "No"}`);
    extraParts.push(`Family HCC: ${tempRecord.familyHCC ? "Yes" : "No"}`);

    const combinedNotes = [tempRecord.notes, extraParts.join(" | ")]
      .filter(Boolean)
      .join(" | ");

    const body = {
      patient_id: patient.patientId,
      symptom_ids: tempRecord.symptomIds,
      notes: combinedNotes,
    };

    try {
      setSaving(true);
      const url = `${AbedEndPoint.symptomEntries}?doctor_id=${doctorId}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.log("Save error", res.status, txt);
        Alert.alert("خطأ", "حدث خطأ أثناء حفظ الأعراض.");
        return;
      }

      Alert.alert("تم", "تم حفظ العرض بنجاح.");
      navigation.goBack();
    } catch (err) {
      console.log("Error saving entry", err);
      Alert.alert("خطأ", "تعذر الاتصال بالخادم.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.patientCard}>
          <Ionicons
            name="person-circle-outline"
            size={40}
            color={colors.accent}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.patientName}>{patient?.name}</Text>
            {patient?.nationalId ? (
              <Text style={styles.patientSub}>
                الرقم الوطني: {patient.nationalId}
              </Text>
            ) : null}
          </View>
        </View>

        <Text style={styles.sectionTitle}>الأعراض</Text>
        {loadingSymptoms ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.mutetxt}>جارٍ تحميل الأعراض...</Text>
          </View>
        ) : generalSymptoms.length === 0 ? (
          <Text style={styles.mutetxt}>لا توجد أعراض مسجلة في النظام.</Text>
        ) : (
          generalSymptoms.map((sym) => (
            <View key={sym.id} style={styles.checkboxRow}>
              <Text style={styles.checkboxLabel}>{sym.name}</Text>
              <Switch
                value={tempRecord.symptomIds.includes(sym.id)}
                onValueChange={() => toggleSymptom(sym.id)}
              />
            </View>
          ))
        )}

        <Text style={styles.sectionTitle}>علامات التهاب</Text>
        {loadingSymptoms ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color={colors.primary} />
          </View>
        ) : signSymptoms.length === 0 ? (
          <Text style={styles.mutetxt}>لا توجد علامات التهاب مسجلة.</Text>
        ) : (
          signSymptoms.map((sym) => (
            <View key={sym.id} style={styles.checkboxRow}>
              <Text style={styles.checkboxLabel}>{sym.name}</Text>
              <Switch
                value={tempRecord.symptomIds.includes(sym.id)}
                onValueChange={() => toggleSymptom(sym.id)}
              />
            </View>
          ))
        )}

        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>تليف الكبد (Cirrhosis)</Text>
          <Switch
            value={tempRecord.cirrhosis}
            onValueChange={(v) =>
              setTempRecord((p) => ({ ...p, cirrhosis: v }))
            }
          />
        </View>

        <View style={styles.checkboxRow}>
          <Text style={styles.checkboxLabel}>
            تاريخ عائلي لسرطان الكبد (HCC)
          </Text>
          <Switch
            value={tempRecord.familyHCC}
            onValueChange={(v) =>
              setTempRecord((p) => ({ ...p, familyHCC: v }))
            }
          />
        </View>

        <Text style={styles.sectionTitle}>ملاحظات</Text>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="أي ملاحظات إضافية"
          value={tempRecord.notes}
          onChangeText={(t) =>
            setTempRecord((p) => ({
              ...p,
              notes: t,
            }))
          }
        />

        <View style={styles.btnWrapper}>
          <TouchableOpacity
            style={[styles.btn, styles.saveBtn]}
            onPress={saveRecord}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="checkmark" size={20} color="#fff" />
            )}
            <Text style={styles.btnTxt}>
              {saving ? "جارٍ الحفظ..." : "حفظ العرض"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  patientCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.textMuted,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  patientName: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "right",
  },
  patientSub: {
    fontSize: typography.caption,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: "right",
    marginTop: spacing.xs,
  },
  sectionTitle: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    textAlign: "right",
  },
  checkboxRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  checkboxLabel: {
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    flex: 1,
    textAlign: "right",
    marginLeft: spacing.sm,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: colors.textMuted,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    minHeight: 90,
    textAlignVertical: "top",
    padding: spacing.md,
    fontSize: typography.body,
    fontFamily: typography.fontFamily,
    textAlign: "right",
  },
  btnWrapper: {
    marginTop: spacing.xl,
  },
  btn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radii.pill,
  },
  saveBtn: {
    backgroundColor: colors.primary,
  },
  btnTxt: {
    color: "#fff",
    fontFamily: typography.fontFamily,
    fontSize: typography.body,
    fontWeight: "600",
    marginHorizontal: spacing.sm,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
  },
  mutetxt: {
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily,
    fontSize: typography.caption,
  },
});
