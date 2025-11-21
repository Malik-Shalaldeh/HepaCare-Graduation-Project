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
  SafeAreaView,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function MedPatientsScreen({ navigation }) {
  const [doctorId, setDoctorId] = useState(null);
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState([]);
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

  const fetchPatients = async (text = "") => {
    if (!doctorId) return;
    setLoading(true);
    try {
      const url =
        `${AbedEndPoint.patientMedsPatients}` +
        `?q=${encodeURIComponent(text)}&doctor_id=${encodeURIComponent(
          doctorId
        )}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("err");
      const data = await res.json();
      setPatients(Array.isArray(data) ? data : []);
    } catch {
      setPatients([]);
      Alert.alert("خطأ", "تعذر جلب المرضى.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchPatients("");
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
    <TouchableOpacity
      style={styles.patientItem}
      onPress={() => openPatient(item)}
      activeOpacity={0.9}
    >
      <View style={styles.patientRight}>
        <View style={styles.iconCircle}>
          <Ionicons name="person-outline" size={20} color={colors.primary} />
        </View>
      </View>
      <View style={styles.patientMiddle}>
        <Text style={[styles.patientName, styles.rtlText]}>{item.name}</Text>
        <Text style={[styles.patientSub, styles.rtlText]}>
          رقم المريض: {item.code || item.patient_code || item.id}
        </Text>
      </View>
      <Ionicons name="chevron-back" size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.searchSection}>
          <Ionicons
            name="search"
            size={24}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.input, styles.rtlText]}
            placeholder={loading ? "جاري البحث..." : "ابحث عن مريض"}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={handleSearch}
            textAlign="right"
          />
        </View>

        <FlatList
          data={patients}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : String(index)
          }
          renderItem={renderPatient}
          ItemSeparatorComponent={() => <View style={{ height: spacing.sm }} />}
          contentContainerStyle={{ paddingBottom: spacing.lg }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              {loading ? "جاري التحميل..." : "لا يوجد مرضى"}
            </Text>
          }
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundLight },

  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg, // ≈16
    paddingTop: spacing.sm + 4,
  },

  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  searchSection: { position: "relative", marginBottom: spacing.sm + 2 },

  searchIcon: {
    position: "absolute",
    top: Platform.select({ ios: spacing.md, android: spacing.md + 2 }),
    left: spacing.sm + 2,
    zIndex: 1,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    padding: Platform.select({ ios: spacing.md, android: spacing.md - 2 }),
    paddingLeft: spacing.xl + 4, // ≈36
    borderRadius: radii.md,
    backgroundColor: colors.background,
    fontSize: typography.bodyLg,
    color: colors.textPrimary,
    ...shadows.light,
  },

  patientItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: radii.md,
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md - 2,
    ...shadows.light,
  },

  patientRight: { marginLeft: spacing.sm + 4 },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(11,79,108,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  patientMiddle: { flex: 1 },

  patientName: {
    fontSize: typography.bodyLg,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },

  patientSub: {
    fontSize: typography.bodySm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    fontFamily: typography.fontFamily,
  },

  emptyText: {
    textAlign: "center",
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
});
