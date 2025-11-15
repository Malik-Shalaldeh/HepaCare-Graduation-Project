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

const COLORS = {
  primary: "#00b29c",
  bg: "#f5f7f8",
  card: "#ffffff",
  text: "#1f2937",
  mutetxt: "#6b7280",
  border: "#e5e7eb",
};

export default function SymptomRecordsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const patient = route.params?.patient;

  const [doctorId, setDoctorId] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const loadPatientEntries = async () => {
    if (!doctorId || !patient?.patientId) return;
    try {
      setLoading(true);
      const url =
        `${AbedEndPoint.symptomEntries}` +
        `?patient_id=${patient.patientId}&doctor_id=${doctorId}`;
      const res = await fetch(url);
      if (!res.ok) {
        console.log("Failed to load entries", res.status);
        return;
      }
      const data = await res.json();
      setRecords(data || []);
    } catch (err) {
      console.log("Error loading entries", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadPatientEntries();
    }, [doctorId, patient?.patientId])
  );

  const renderRecord = ({ item, index }) => (
    <View style={styles.recordCard}>
      <Text style={styles.recordTitle}>
        تتبع #{index + 1} - {item.visitDate}
      </Text>
      <Text style={styles.recordLabel}>الأعراض:</Text>
      <Text style={styles.recordText}>{item.symptoms || "لا توجد أعراض"}</Text>

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
            color={COLORS.primary}
          />
        </View>

        <View style={styles.headerRow}>
          <Text style={styles.sectionTitle}>سجل الأعراض</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate("SymptomAdd", { patient })}
          >
            <Ionicons name="add-circle" size={22} color="#fff" />
            <Text style={styles.addTxt}>تسجيل عرض</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
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
            keyExtractor={(_, i) => i.toString()}
            renderItem={renderRecord}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
    padding: 16,
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
    marginTop: 2,
    textAlign: "right",
  },
  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
  },
  addTxt: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
    fontSize: 14,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mutetxt: {
    color: COLORS.mutetxt,
    marginTop: 8,
  },
  recordCard: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recordTitle: {
    fontWeight: "700",
    fontSize: 15,
    marginBottom: 6,
    color: COLORS.text,
    textAlign: "right",
  },
  recordLabel: {
    fontWeight: "600",
    marginTop: 4,
    marginBottom: 2,
    color: COLORS.text,
    textAlign: "right",
  },
  recordText: {
    fontSize: 14,
    color: COLORS.mutetxt,
    textAlign: "right",
  },
});
