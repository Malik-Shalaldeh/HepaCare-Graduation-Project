// componentDoctor/HealthMedComponent.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Switch,
  Alert,
  Platform,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AbedEndPoint from "../AbedEndPoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

export default function HealthMedComponent() {
  const [meds, setMeds] = useState([]); // [{id, Name, isAvailable}]
  const [availableMedsMap, setAvailableMedsMap] = useState({}); // {id: bool}
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadMeds = async () => {
    try {
      const res = await fetch(`${AbedEndPoint.healthMeds}?only_available=0`, {
        headers: { Accept: "application/json" },
      });
      const data = await res.json();
      const safe = Array.isArray(data) ? data : [];
      setMeds(safe);
      const map = {};
      safe.forEach((m) => {
        if (m && typeof m.id !== "undefined") map[m.id] = !!m.isAvailable;
      });
      setAvailableMedsMap(map);
    } catch (e) {
      console.log("Load meds error:", e);
      Alert.alert("خطأ", "فشل تحميل الأدوية من السيرفر");
      setMeds([]);
      setAvailableMedsMap({});
    }
  };

  useEffect(() => {
    loadMeds();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadMeds();
    setRefreshing(false);
  }, []);

  const handleToggle = async (med) => {
    if (!med || typeof med.id === "undefined" || med.id === null) {
      Alert.alert("تنبيه", "معرّف الدواء غير متوفر");
      return;
    }
    const current = !!availableMedsMap[med.id];
    const newValue = !current;

    try {
      const url = AbedEndPoint.setHealthMedAvailability(med.id, newValue);
      const res = await fetch(url, {
        method: "PATCH",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("PATCH failed");

      setAvailableMedsMap((prev) => ({ ...(prev || {}), [med.id]: newValue }));
      setMeds((prev) =>
        Array.isArray(prev)
          ? prev.map((m) =>
              m?.id === med.id ? { ...m, isAvailable: newValue ? 1 : 0 } : m
            )
          : []
      );
      if (newValue) {
        Alert.alert(
          "دواء متوفر",
          `دواء ${String(med?.Name ?? "")} متوفر الآن في الصحة`
        );
      }
    } catch (e) {
      console.log("Toggle error:", e);
      Alert.alert("خطأ", "تعذّر تحديث حالة الدواء");
    }
  };

  const displayedMeds = Array.isArray(meds)
    ? meds.filter(
        (m) => m && typeof m.id !== "undefined" && availableMedsMap[m.id]
      )
    : [];

  const renderMedCard = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.cardIconWrap}>
          <Ionicons name="bandage-outline" size={22} color={colors.accent} />
        </View>
        <Text style={[styles.cardTitle, styles.rtl]} numberOfLines={2}>
          {String(item?.Name ?? "")}
        </Text>
      </View>

      <View style={styles.badgeRow}>
        <View style={[styles.badge, styles.badgeSuccess]}>
          <View style={styles.dot} />
          <Text style={styles.badgeText}>متوفر</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* رأس مبسّط */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, styles.rtl]}>
            إجمالي الأدوية المتوفرة: {displayedMeds.length}
          </Text>
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.9}
          >
            <Ionicons name="medkit-outline" size={18} color="#fff" />
            <Text style={styles.manageBtnText}>إدارة الأدوية</Text>
          </TouchableOpacity>
        </View>

        {/* قائمة حديثة بشكل كروت */}
        {displayedMeds.length === 0 ? (
          <Text style={[styles.emptyText, styles.rtl]}>
            لا توجد أدوية متوفرة حالياً
          </Text>
        ) : (
          <FlatList
            data={displayedMeds}
            keyExtractor={(item, index) =>
              typeof item?.id !== "undefined" ? String(item.id) : String(index)
            }
            renderItem={renderMedCard}
            contentContainerStyle={{ paddingBottom: spacing.xl }}
            keyboardShouldPersistTaps="handled"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
        )}

        {/* مودال الإدارة بالتبديل */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.rtl]}>إدارة الأدوية</Text>

              <FlatList
                data={Array.isArray(meds) ? meds : []}
                keyExtractor={(item, index) =>
                  typeof item?.id !== "undefined" && item?.id !== null
                    ? String(item.id)
                    : `med__${index}`
                }
                renderItem={({ item }) => (
                  <View style={styles.switchRow}>
                    <Text style={[styles.switchText, styles.rtl]}>
                      {String(item?.Name ?? "")}
                    </Text>
                    <Switch
                      value={!!availableMedsMap?.[item?.id]}
                      onValueChange={() => handleToggle(item)}
                      trackColor={{
                        false: colors.border,
                        true: colors.accent,
                      }}
                      thumbColor={
                        Platform.OS === "android" ? colors.primary : undefined
                      }
                    />
                  </View>
                )}
                style={{ marginBottom: spacing.lg, maxHeight: 320 }}
              />

              <TouchableOpacity
                style={[styles.modalButton, styles.closeBtn]}
                onPress={() => setModalVisible(false)}
                activeOpacity={0.9}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.modalBtnText}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.backgroundLight },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md, // بدون StatusBar.currentHeight لتجنّب التعارض مع هيدر الStack
  },
  rtl: {
    writingDirection: "rtl",
    textAlign: "right",
    fontFamily: typography.fontFamily,
  },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.buttonSuccess,
    paddingVertical: Platform.select({ ios: spacing.md, android: spacing.sm }),
    paddingHorizontal: spacing.md,
    borderRadius: radii.md,
    ...shadows.light,
  },
  manageBtnText: {
    color: colors.buttonSuccessText,
    fontSize: typography.bodyMd,
    fontWeight: "700",
    marginLeft: spacing.sm,
    fontFamily: typography.fontFamily,
  },

  // بطاقة الدواء
  card: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    marginVertical: spacing.xs + 2,
    ...shadows.light,
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.buttonMuted,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: spacing.sm,
  },
  cardTitle: {
    flex: 1,
    fontSize: typography.bodyLg,
    fontWeight: "700",
    color: colors.textPrimary,
    fontFamily: typography.fontFamily,
  },

  badgeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm,
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.xs + 2,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md - 2,
    borderRadius: radii.pill,
  },
  badgeSuccess: {
    backgroundColor: "rgba(47, 164, 169, 0.12)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radii.pill,
    backgroundColor: colors.success,
  },
  badgeText: {
    color: colors.success,
    fontWeight: "700",
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
  },

  // نصوص ومودال
  emptyText: {
    textAlign: "center",
    marginTop: spacing.xl + 16,
    color: colors.textMuted,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  modalOverlay: { flex: 1, backgroundColor: colors.overlay },
  modalContent: {
    marginTop: Platform.select({ ios: 100, android: 60 }),
    marginHorizontal: spacing.xl,
    backgroundColor: colors.background,
    borderRadius: radii.md,
    padding: spacing.xl,
    paddingBottom: spacing.xl + 2,
    ...shadows.medium,
  },
  modalTitle: {
    fontSize: typography.headingSm,
    fontWeight: "800",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.md,
    fontFamily: typography.fontFamily,
  },
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm + 2,
  },
  switchText: {
    fontSize: typography.bodyLg,
    color: colors.textSecondary,
    width: "80%",
    fontFamily: typography.fontFamily,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    borderRadius: radii.md,
  },
  closeBtn: { backgroundColor: colors.buttonDanger },
  modalBtnText: {
    color: colors.buttonDangerText,
    fontWeight: "700",
    fontSize: typography.bodyLg,
    marginLeft: spacing.sm,
    fontFamily: typography.fontFamily,
  },
});
