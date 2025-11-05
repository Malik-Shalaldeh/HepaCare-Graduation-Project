// screensDoctor/MedPatientsScreen.jsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
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

const API = "http://192.168.1.120:8000";

export default function MedPatientsScreen({ navigation }) {
  const [doctorId, setDoctorId] = useState(null);
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب رقم الدكتور
  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const stored = await AsyncStorage.getItem("doctor_id");
        if (stored) setDoctorId(parseInt(stored, 10));
        else setDoctorId(420094999);
      } catch (e) {
        setDoctorId(420094999);
      }
    };
    loadDoctor();
  }, []);

  const fetchPatients = async (text = "") => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/patient-medications/patients?q=${encodeURIComponent(
          text
        )}&doctor_id=${doctorId}`
      );
      if (!res.ok) throw new Error("err");
      const data = await res.json();
      setPatients(data);
    } catch (err) {
      setPatients([]);
      Alert.alert("خطأ", "تعذر جلب المرضى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchPatients("");
    }
  }, [doctorId]);

  const handleSearch = (text) => {
    setSearch(text);
    fetchPatients(text);
  };

  const openPatient = (item) => {
    if (!item?.id) {
      Alert.alert("تنبيه", "هذا المريض غير صالح.");
      return;
    }
    navigation.navigate("PatientMedications", {
      patientId: item.id,
      patientName: item.name,
    });
  };

  const renderPatient = ({ item }) => (
    <TouchableOpacity style={styles.patientItem} onPress={() => openPatient(item)}>
      <View style={styles.patientRight}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-outline" size={20} color="#00b29c" />
        </View>
      </View>
      <View style={styles.patientMiddle}>
        <Text style={[styles.patientName, styles.rtlText]}>{item.name}</Text>
        <Text style={[styles.patientSub, styles.rtlText]}>
          رقم المريض: {item.code || item.patient_code || item.id}
        </Text>
      </View>
      <Ionicons name="chevron-back" size={20} color="#999" />
    </TouchableOpacity>
  );

  return (
    <ScreenWithDrawer title="أدوية المرضى">
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaView style={styles.safeArea} />
      <View style={styles.container}>
        {/* البحث */}
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={24}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.input, styles.rtlText]}
            placeholder={loading ? "جاري البحث..." : "ابحث عن مريض"}
            placeholderTextColor="#888"
            value={search}
            onChangeText={handleSearch}
          />
        </View>

        {/* لستة المرضى */}
        <FlatList
          data={patients}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : index.toString()
          }
          renderItem={renderPatient}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? "جاري التحميل..." : "لا يوجد مرضى"}
            </Text>
          }
        />
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
  searchSection: {
    position: "relative",
    marginBottom: 12,
  },
  searchIcon: {
    position: "absolute",
    top: Platform.select({ ios: 12, android: 14 }),
    left: 10,
    zIndex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    padding: Platform.select({ ios: 12, android: 10 }),
    paddingLeft: 36,
    borderRadius: 12,
    backgroundColor: "#FFF",
    fontSize: 16,
    color: "#333",
  },
  patientItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
  },
  patientRight: {
    marginLeft: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(0,178,156,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  patientMiddle: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  patientSub: {
    fontSize: 12,
    color: "#777",
    marginTop: 2,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    color: "#888",
    fontSize: 14,
  },
});
