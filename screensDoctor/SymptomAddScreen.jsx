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

const COLORS = {
  primary: "#00b29c",
  bg: "#f5f7f8",
  card: "#ffffff",
  text: "#1f2937",
  mutetxt: "#6b7280",
  border: "#e5e7eb",
};

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
    const init = async () => {
      try {
        const id = await AsyncStorage.getItem("doctor_id");
        if (id) setDoctorId(parseInt(id, 10));
      } catch (e) {
        console.log("Error loading doctor_id", e);
      }
      await fetchSymptoms();
    };
    init();
  }, []);

  const fetchSymptoms = async () => {
    try {
      setLoadingSymptoms(true);
      const res = await fetch(AbedEndPoint.symptomSymptoms);
      if (!res.ok) {
        console.log("Failed to load symptoms", res.status);
        return;
      }
      const data = await res.json();
      setApiSymptoms(data || []);
    } catch (err) {
      console.log("Error fetching symptoms", err);
    } finally {
      setLoadingSymptoms(false);
    }
  };

  const generalSymptoms = apiSymptoms.filter(
    (s) => !s.code || !s.code.toUpperCase().startsWith("SIGN-")
  );
  const signSymptoms = apiSymptoms.filter(
    (s) => s.code && s.code.toUpperCase().startsWith("SIGN-")
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
      navigation.goBack(); // يرجع لسجل الأعراض
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
            color={COLORS.primary}
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
            <ActivityIndicator size="large" color={COLORS.primary} />
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
            <ActivityIndicator size="small" color={COLORS.primary} />
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
    backgroundColor: COLORS.bg,
  },
  container: {
    padding: 16,
    paddingBottom: 24,
  },
  patientCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  patientName: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "right",
  },
  patientSub: {
    fontSize: 13,
    color: COLORS.mutetxt,
    textAlign: "right",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.text,
    marginTop: 10,
    marginBottom: 6,
    textAlign: "right",
  },
  checkboxRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  checkboxLabel: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    textAlign: "right",
    marginLeft: 10,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    minHeight: 90,
    textAlignVertical: "top",
    padding: 10,
    fontSize: 14,
    textAlign: "right",
  },
  btnWrapper: {
    marginTop: 18,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 22,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
  },
  btnTxt: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 6,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  mutetxt: {
    color: COLORS.mutetxt,
    marginTop: 4,
  },
});
