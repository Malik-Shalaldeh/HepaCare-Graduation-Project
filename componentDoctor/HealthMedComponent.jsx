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
          <Ionicons name="bandage-outline" size={22} color="#00b29c" />
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
            contentContainerStyle={{ paddingBottom: 24 }}
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
                    />
                  </View>
                )}
                style={{ marginBottom: 20, maxHeight: 320 }}
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
  safeArea: { flex: 1, backgroundColor: "#F5F5F5" },
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: 12, // بدون StatusBar.currentHeight لتجنّب التعارض مع هيدر الStack
  },
  rtl: { writingDirection: "rtl", textAlign: "right" },

  header: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#333" },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#4CAF50",
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    paddingHorizontal: 12,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  manageBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },

  // بطاقة الدواء
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(0,178,156,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  cardTitle: { flex: 1, fontSize: 16, fontWeight: "700", color: "#333" },

  badgeRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  badgeSuccess: {
    backgroundColor: "rgba(76,175,80,0.1)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: "#4CAF50",
  },
  badgeText: { color: "#2e7d32", fontWeight: "700", fontSize: 12 },

  // نصوص ومودال
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#888",
    fontSize: 15,
  },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: {
    marginTop: Platform.select({ ios: 100, android: 60 }),
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    paddingBottom: 26,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#333",
    textAlign: "center",
    marginBottom: 14,
  },
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  switchText: { fontSize: 15, color: "#444", width: "80%" },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
  },
  closeBtn: { backgroundColor: "#F44336" },
  modalBtnText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 15,
    marginLeft: 6,
  },
});
