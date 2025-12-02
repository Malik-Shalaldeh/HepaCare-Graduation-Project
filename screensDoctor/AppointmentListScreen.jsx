// sami - Refactored to Malik-style
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import ENDPOINTS from "../samiendpoint";
import ScreenWithDrawer from "./ScreenWithDrawer";
import {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from "../style/theme";

const primary = colors.primary;

const AppointmentListScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // state
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // format appointment data
  const formatAppointment = (row, patientName) => {
    const rawStart = row.start_at || "";
    const start = rawStart ? new Date(rawStart.replace(" ", "T")) : new Date();

    return {
      id: row.id,
      patientId: row.patient_id,
      patientName: patientName || `مريض رقم ${row.patient_id}`,
      startAt: rawStart,
      dateText: start.toLocaleDateString(),
      timeText: start.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      notes: row.notes || "",
    };
  };

  // load appointments data
  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      setError("");

      const doctorId = await AsyncStorage.getItem("doctor_id");

      if (!doctorId) {
        setError("لا يوجد رقم طبيب محفوظ");
        setAppointments([]);
        return;
      }

      // fetch patients for name lookup
      const patientsResponse = await axios.get(
        `${ENDPOINTS.patientsList}?doctor_id=${doctorId}`
      );
      const patientsData = patientsResponse.data;

      // create patient name lookup
      const patientLookup = {};
      patientsData.forEach((patient) => {
        const name = patient.name ?? patient.full_name ?? `مريض رقم ${patient.id || patient.patient_id}`;
        const id = patient.id ?? patient.patient_id;
        patientLookup[id] = name;
      });

      // fetch appointments
      const apptsResponse = await axios.get(
        ENDPOINTS.doctorAppointments(doctorId)
      );
      const rows = apptsResponse.data.appointments || [];

      // format appointments with patient names
      const formatted = rows.map((row) =>
        formatAppointment(row, patientLookup[row.patient_id])
      );

      setAppointments(formatted);
    } catch (err) {
      setError(err.message || "تعذر تحميل المواعيد");
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  };

  // load data on focus
  useEffect(() => {
    if (isFocused) {
      loadAppointments();
    }
  }, [isFocused]);

  // delete appointment
  const handleDelete = async (appointmentId) => {
    try {
      await axios.delete(ENDPOINTS.doctorAppointmentDelete(appointmentId));
      // reload appointments after deletion
      await loadAppointments();
    } catch (err) {
      Alert.alert("خطأ", err.message || "تعذر حذف الموعد");
    }
  };

  const openForm = (appointment) => {
    navigation.navigate(
      "AppointmentForm",
      appointment ? { appointment } : undefined
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity style={{ flex: 1 }} onPress={() => openForm(item)}>
        <View style={styles.cardContent}>
          <Ionicons
            name="calendar"
            size={24}
            color={primary}
            style={styles.icon}
          />
          <View>
            <Text style={styles.title}>{item.patientName}</Text>
            <Text style={styles.subtitle}>
              {item.dateText}  |  {item.timeText}
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => handleDelete(item.id)}
      >
        <Ionicons name="close" size={20} color={colors.danger || "#f44336"} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWithDrawer title="المواعيد">
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => openForm()}
        activeOpacity={0.8}
      >
        <Ionicons
          name="add"
          size={20}
          color={colors.buttonPrimaryText}
          style={{ marginEnd: 4 }}
        />
        <Text style={styles.addText}>إضافة موعد جديد</Text>
      </TouchableOpacity>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {isLoading && !appointments.length ? (
        <ActivityIndicator color={primary} style={styles.loadingIndicator} />
      ) : null}

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>لا توجد مواعيد حاليًا</Text>
        }
        contentContainerStyle={
          appointments.length ? undefined : styles.emptyContainer
        }
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadAppointments}
            tintColor={primary}
          />
        }
      />
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.sm,
    borderRadius: radii.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.small,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginEnd: spacing.md,
  },
  title: {
    fontSize: typography.bodyMd,
    fontWeight: "bold",
    color: primary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  subtitle: {
    fontSize: typography.bodySm,
    color: colors.textSecondary,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cancelBtn: {
    padding: spacing.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: spacing.xl,
  },
  empty: {
    fontSize: typography.bodyMd,
    color: colors.textSecondary,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.buttonPrimary || primary,
    paddingVertical: spacing.md,
    borderRadius: radii.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    ...shadows.light,
  },
  addText: {
    color: colors.buttonPrimaryText,
    fontSize: typography.bodyMd,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
  },
  error: {
    color: colors.danger || "#f44336",
    textAlign: "center",
    marginBottom: spacing.sm,
    fontSize: typography.bodySm,
  },
  loadingIndicator: {
    marginVertical: spacing.md,
  },
});

export default AppointmentListScreen;
