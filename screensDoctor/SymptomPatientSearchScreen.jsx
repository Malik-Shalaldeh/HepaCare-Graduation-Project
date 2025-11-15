// screensDoctor/SymptomPatientSearchScreen.jsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import AbedEndPoint from "../AbedEndPoint";

const COLORS = {
  primary: "#00b29c",
  bg: "#f5f7f8",
  card: "#ffffff",
  text: "#1f2937",
  mutetxt: "#6b7280",
  border: "#e5e7eb",
};

export default function SymptomPatientSearchScreen() {
  const navigation = useNavigation();

  const [doctorId, setDoctorId] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const id = await AsyncStorage.getItem("doctor_id");
        if (id) setDoctorId(parseInt(id, 10));
      } catch (e) {
        console.log("Error loading doctor_id", e);
      }
    };
    init();
  }, []);

  const fetchPatients = async (query = "") => {
    if (!doctorId) return;
    try {
      setLoading(true);
      const url =
        `${AbedEndPoint.symptomPatients}?doctor_id=${doctorId}` +
        (query ? `&query=${encodeURIComponent(query)}` : "");
      const res = await fetch(url);
      if (!res.ok) {
        console.log("Failed to load patients", res.status);
        return;
      }
      const data = await res.json();
      setPatients(data || []);
    } catch (err) {
      console.log("Error loading patients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchPatients("");
    }
  }, [doctorId]);

  const handleSearchChange = (text) => {
    setSearch(text);
    const q = text.trim();
    fetchPatients(q);
  };

  const renderPatient = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SymptomRecords", { patient: item })}
    >
      <View style={styles.cardRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.patientName}>{item.name}</Text>
          {item.nationalId ? (
            <Text style={styles.patientSub}>
              الرقم الوطني: {item.nationalId}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-back" size={22} color={COLORS.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={20}
            color={COLORS.mutetxt}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث باسم المريض"
            value={search}
            onChangeText={handleSearchChange}
          />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.mutetxt}>جارٍ تحميل المرضى...</Text>
          </View>
        ) : patients.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.mutetxt}>
              لا يوجد مرضى مسجّلين لهذا الطبيب.
            </Text>
          </View>
        ) : (
          <FlatList
            data={patients}
            keyExtractor={(item) => item.patientId.toString()}
            renderItem={renderPatient}
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
  searchWrapper: {
    position: "relative",
    marginBottom: 12,
  },
  searchIcon: {
    position: "absolute",
    right: 12,
    top: 11,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    paddingVertical: 9,
    paddingHorizontal: 40,
    fontSize: 16,
    textAlign: "right",
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  patientName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "right",
  },
  patientSub: {
    fontSize: 13,
    color: COLORS.mutetxt,
    marginTop: 2,
    textAlign: "right",
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
});
