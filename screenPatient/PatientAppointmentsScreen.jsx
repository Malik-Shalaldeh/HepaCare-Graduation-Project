// sami
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const primary = colors.primary;

const PatientAppointmentsScreen = () => {
  const navigation = useNavigation();

  const [appointments, setAppointments] = useState([]);
  const [clinicName, setClinicName] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const getStoredPatientId = useCallback(async () => {
    const keys = ["patient_id", "patientId", "user_id", "userId", "id"];
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) return value;
    }
    return null;
  }, []);

  const normalizeAppointment = (row) => {
    const rawStart = row.start_at || "";
    const startDate = rawStart ? new Date(rawStart.replace(" ", "T")) : null;

    return {
      id: String(row.id),
      date: startDate
        ? startDate.toLocaleDateString()
        : "غير محدد",
      time: startDate
        ? startDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
      doctor: row.doctor_name || `دكتور رقم ${row.doctor_id}`,
      clinic: row.clinic_name || "",
      notes: row.notes || "",
    };
  };

  const loadAppointments = useCallback(async () => {
    setRefreshing(true);
    try {
      setError("");
      const patientId = await getStoredPatientId();

      if (!patientId) {
        setAppointments([]);
        setClinicName("");
        setError("لم يتم العثور على رقم المريض.");
        return;
      }

      const response = await fetch(
        ENDPOINTS.patientAppointmentsByPatient(patientId),
        { headers: { Accept: "application/json" } }
      );

      if (!response.ok) {
        throw new Error("تعذر جلب المواعيد");
      }

      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.appointments || [];
      const normalized = rows.map(normalizeAppointment);

      setAppointments(normalized);
      setClinicName(normalized[0]?.clinic || "");
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء تحميل المواعيد");
      setAppointments([]);
      setClinicName("");
    } finally {
      setRefreshing(false);
    }
  }, [getStoredPatientId]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons
          name="calendar-outline"
          size={22}
          color={primary}
          style={styles.icon}
        />
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>

      <Text style={styles.doctor}>{item.doctor}</Text>
      {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      {/* زر الرجوع على الشمال (نفس ستايل الشاشات الثانية) */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color={primary} />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.clinicName}>
          {clinicName || "مواعيدي"}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {refreshing && !appointments.length ? (
          <ActivityIndicator
            color={primary}
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={
              appointments.length
                ? undefined
                : styles.emptyContainer
            }
            ListEmptyComponent={
              <Text style={styles.emptyText}>
                لا يوجد مواعيد حالياً
              </Text>
            }
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadAppointments}
                tintColor={primary}
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  backButton: {
    position: "absolute",
    top: spacing.md,
    left: spacing.lg,
    padding: spacing.sm,
    borderRadius: 25,
    backgroundColor: colors.background,
    zIndex: 1,
    ...shadows.small,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: spacing.xxl * 2, // عشان ما يتغطى العنوان بزر الرجوع
  },
  clinicName: {
    fontSize: typography.bodyLg,
    fontWeight: "700",
    color: primary,
    marginBottom: spacing.lg,
    alignSelf: "center",
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.small,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.xs,
  },
  icon: {
    marginEnd: spacing.sm,
  },
  date: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    fontWeight: "700",
    marginEnd: spacing.sm,
  },
  time: {
    fontSize: typography.bodySm,
    color: primary,
    fontWeight: "700",
  },
  doctor: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    marginTop: spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  notes: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    textAlign: "right",
    writingDirection: "rtl",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xl,
  },
  emptyText: {
    textAlign: "center",
    color: colors.textSecondary,
    fontSize: typography.bodyMd,
  },
  error: {
    color: "#d32f2f",
    textAlign: "center",
    marginBottom: spacing.sm,
    fontSize: typography.bodySm,
  },
  loader: {
    marginTop: spacing.xl,
  },
});

export default PatientAppointmentsScreen;
