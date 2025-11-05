import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API = "http://192.168.1.123:8000";

export default function MyMedicationsScreen() {
  const navigation = useNavigation();
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
      if (!patientId) {
        patientId = await getStoredPatientId();
      }

      if (!patientId) {
        console.log("⚠️ ما في patientId");
        setMedications([]);
        return;
      }

      const url = `${API}/patient-medications/by-patient/${patientId}`;
      console.log("🔗 GET:", url);

      const res = await fetch(url);
      const data = await res.json();
      console.log("✅ raw data from API:", data);

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

      console.log("🟦 normalized:", normalized);
      setMedications(normalized);
    } catch (e) {
      console.log("❌ error fetching meds:", e);
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
        <Ionicons name="flask-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>الجرعة: {item.dosage || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="repeat-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>التكرار: {item.frequency || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="time-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>وقت الجرعة: {item.doseTime || "-"}</Text>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="alarm-outline" size={20} color="#1ABC9C" />
        <Text style={styles.value}>
          الساعة المخصصة: {item.timeToTake || "-"}
        </Text>
      </View>

      {item.additionalInstructions ? (
        <View style={styles.infoRow}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#1ABC9C"
          />
          <Text style={styles.value}>
            تعليمات: {item.additionalInstructions}
          </Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <ScreenWithDrawer>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Ionicons
              name="medkit-outline"
              size={32}
              color="#ffffff"
              style={{ marginBottom: 4 }}
            />
            <Text style={styles.headerTitle}>{`أدويتي`}</Text>
          </View>

          {loading ? (
            <ActivityIndicator
              size="large"
              color="#16A085"
              style={{ marginTop: 40 }}
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
                  <Text style={{ textAlign: "center", marginBottom: 10 }}>
                    عدد الأدوية: {medications.length}
                  </Text>
                )
              }
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f4f4",
  },
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
  },
  headerContainer: {
    width: "100%",
    backgroundColor: "#16A085",
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  backButton: {
    position: "absolute",
    left: 20,
    top: Platform.OS === "android" ? StatusBar.currentHeight + 18 : 18,
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    writingDirection: "rtl",
  },
  noMedsText: {
    textAlign: "center",
    marginTop: 30,
    marginBottom: 10,
    color: "#6b7280",
    fontSize: 16,
    writingDirection: "rtl",
  },
  medList: {
    paddingBottom: 100,
  },
  medCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: "#1ABC9C",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    writingDirection: "rtl",
  },
  medName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333333",
    marginBottom: 12,
    textAlign: "right",
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
  },
  value: {
    flex: 1,
    fontSize: 14,
    color: "#374151",
    marginLeft: 8,
    textAlign: "right",
  },
});
