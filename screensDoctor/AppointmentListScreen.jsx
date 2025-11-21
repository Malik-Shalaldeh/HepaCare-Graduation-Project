// Developed by Sami
import React, { useContext } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { AppointmentsContext } from "../contexts/AppointmentsContext";
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
  const { appointments, deleteAppointment, loading, error, refresh } =
    useContext(AppointmentsContext);

  const openForm = (appointment) => {
    navigation.navigate(
      "AppointmentForm",
      appointment ? { appointment } : undefined
    );
  };

  const handleDelete = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
    } catch (err) {
      Alert.alert("خطأ", err.message || "تعذر حذف الموعد");
    }
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

      {loading && !appointments.length ? (
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
            refreshing={loading}
            onRefresh={refresh}
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
