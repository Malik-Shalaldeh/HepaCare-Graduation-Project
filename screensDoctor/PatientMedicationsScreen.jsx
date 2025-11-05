// screensDoctor/PatientMedicationsScreen.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScreenWithDrawer from "./ScreenWithDrawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import AbedEndPoint from "../AbedEndPoint";

export default function PatientMedicationsScreen({ route, navigation }) {
  const { patientId, patientName } = route.params;
  const [doctorId, setDoctorId] = useState(null);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب الدكتور
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const stored = await AsyncStorage.getItem("doctor_id");
        if (stored) setDoctorId(parseInt(stored, 10));
        else setDoctorId(420094999);
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
    } catch (err) {
      setMedications([]);
      Alert.alert("خطأ", "تعذر جلب أدوية المريض.");
    } finally {
      setLoading(false);
    }
  };

  // كل ما تنفتح الشاشة
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
    if (!doctorId) {
      Alert.alert("خطأ", "تعذر تحديد رقم الطبيب.");
      return;
    }
    try {
      const url =
        `${AbedEndPoint.patientMedicationById(med.id)}` +
        `?doctor_id=${encodeURIComponent(doctorId)}`;

      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok && res.status !== 204) {
        const txt = await res.text();
        throw new Error(txt || "تعذر حذف الدواء");
      }
      setMedications((prev) => prev.filter((m) => m.id !== med.id));
    } catch (err) {
      Alert.alert("خطأ", "تعذر حذف الدواء.");
    }
  };

  const renderMedicationItem = ({ item }) => (
    <View style={styles.medItem}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.medName, styles.rtlText]}>
          {item.name || item.medication_name}
        </Text>

        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="flask-outline" size={16} /> الجرعة: {item.dosage}
        </Text>
        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="repeat-outline" size={16} /> التكرار: {item.frequency}
        </Text>
        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="time-outline" size={16} /> وقت الجرعة: {item.doseTime}
        </Text>
        <Text style={[styles.infoText, styles.rtlText]}>
          <Ionicons name="alarm-outline" size={16} /> الساعة المخصصة:{" "}
          {item.timeToTake}
        </Text>
        {item.additionalInstructions ? (
          <Text style={[styles.infoText, styles.rtlText]}>
            <Ionicons name="information-circle-outline" size={16} /> تعليمات:{" "}
            {item.additionalInstructions}
          </Text>
        ) : null}
      </View>
      <View style={styles.medActions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => goToEdit(item)}
        >
          <Ionicons name="create-outline" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
          onPress={() => deleteMedication(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScreenWithDrawer title="أدوية المريض">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.container}>
        {/* رجوع */}
        <TouchableOpacity
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={[styles.subtitle, styles.rtlText]}>
          متابعات {patientName}
        </Text>

        {/* زر الجدولة */}
        <TouchableOpacity style={styles.addButton} onPress={goToAdd}>
          <Ionicons name="add-circle" size={24} color="#fff" />
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
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderMedicationItem}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        )}
      </View>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  backArrow: {
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 8,
  },
  noMedsText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 16,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
    alignSelf: "flex-start",
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  medItem: {
    flexDirection: "row-reverse",
    backgroundColor: "#FFF",
    padding: Platform.select({ ios: 16, android: 14 }),
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 2,
  },
  medActions: {
    justifyContent: "space-between",
    marginRight: 10,
  },
  actionBtn: {
    padding: 8,
    borderRadius: 6,
    marginVertical: 2,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  editBtn: {
    backgroundColor: "#2196F3",
  },
  deleteBtn: {
    backgroundColor: "#F44336",
  },
});
