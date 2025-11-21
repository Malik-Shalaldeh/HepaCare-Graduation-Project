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
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function SymptomPatientSearchScreen() {
  const navigation = useNavigation();

  const [doctorId, setDoctorId] = useState(null);
  const [patients, setPatients] = useState([]); // normalized [{patientId,name,nationalId}]
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const id = await AsyncStorage.getItem("doctor_id");
        if (mounted) setDoctorId(id ? parseInt(id, 10) : null);
      } catch (e) {
        if (mounted) setDoctorId(null);
      }
    };

    init();
    return () => {
      mounted = false;
    };
  }, []);

  const fetchPatients = async (query = "") => {
    if (!doctorId) return;

    try {
      setLoading(true);
      const url =
        `${AbedEndPoint.symptomPatients}?doctor_id=${encodeURIComponent(
          doctorId
        )}` + (query ? `&query=${encodeURIComponent(query)}` : "");

      const res = await fetch(url, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();

      const safe = Array.isArray(data)
        ? data
            .filter((x) => x)
            .map((x) => ({
              patientId: x.patientId ?? x.patient_id ?? x.id,
              name:
                x.name ??
                x.fullName ??
                x.full_name ??
                x.patient_name ??
                "المريض",
              nationalId:
                x.nationalId ?? x.national_id ?? x.nationalID ?? "",
            }))
            .filter((p) => p.patientId !== undefined && p.patientId !== null)
        : [];

      setPatients(safe);
    } catch (err) {
      console.log("Error loading patients", err);
      setPatients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) fetchPatients("");
  }, [doctorId]);

  const handleSearchChange = (text) => {
    setSearch(text);
    fetchPatients(text.trim());
  };

  const renderPatient = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("SymptomRecords", { patient: item })}
      activeOpacity={0.9}
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
        <Ionicons name="chevron-back" size={22} color={colors.accent} />
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
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث باسم المريض"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={handleSearchChange}
          />
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
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
            keyExtractor={(item, idx) =>
              item.patientId ? String(item.patientId) : String(idx)
            }
            renderItem={renderPatient}
            contentContainerStyle={{ paddingVertical: spacing.sm }}
            keyboardShouldPersistTaps="handled"
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
  searchWrapper: {
    position: "relative",
    marginBottom: spacing.md,
  },
  searchIcon: {
    position: "absolute",
    right: spacing.md,
    top: 11,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.lg,
    backgroundColor: colors.background,
    paddingVertical: 9,
    paddingHorizontal: 40,
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
    color: colors.textPrimary,
    textAlign: "right",
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  patientName: {
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "right",
  },
  patientSub: {
    fontSize: 13,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "right",
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
});
