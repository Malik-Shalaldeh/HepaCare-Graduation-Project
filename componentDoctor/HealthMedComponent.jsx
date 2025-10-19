// componentDoctor/HealthMedComponent.jsx

import React, { useState, useEffect } from "react";
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
  StatusBar,
  I18nManager,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const API = "http://192.168.1.122:8000"; // عدّل إذا لزم

export default function HealthMedComponent() {
  const navigation = useNavigation();

  // === الحالة القادمة من السيرفر ===
  const [meds, setMeds] = useState([]); // [{id, Name, isAvailable, ...}]
  const [availableMedsMap, setAvailableMedsMap] = useState({}); // {id: bool}
  const [modalVisible, setModalVisible] = useState(false);

  // تحميل جميع الأدوية مع الحالة
  const loadMeds = async () => {
    try {
      const res = await fetch(`${API}/health-meds?only_available=0`);
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

  // تبديل الحالة عبر API ثم تحديث الحالة المحلية
  const handleToggle = async (med) => {
    if (!med || typeof med.id === "undefined" || med.id === null) {
      Alert.alert("تنبيه", "معرّف الدواء غير متوفر");
      return;
    }
    const current = !!availableMedsMap[med.id];
    const newValue = !current;

    try {
      const url = `${API}/health-meds/set-availability?med_id=${encodeURIComponent(
        med.id
      )}&available=${newValue ? 1 : 0}`;
      const res = await fetch(url, { method: "PATCH" });
      if (!res.ok) throw new Error("PATCH failed");

      // تحديث الحالة محليًا
      setAvailableMedsMap((prev) => ({ ...(prev || {}), [med.id]: newValue }));
      setMeds((prev) =>
        Array.isArray(prev)
          ? prev.map((m) =>
              m?.id === med.id ? { ...m, isAvailable: newValue ? 1 : 0 } : m
            )
          : []
      );
      if (newValue) {
        Alert.alert("دواء متوفر", `دواء ${String(med?.Name ?? "")} متوفر الآن في الصحة`);
      }
    } catch (e) {
      console.log("Toggle error:", e);
      Alert.alert("خطأ", "تعذّر تحديث حالة الدواء");
    }
  };

  // قائمة العرض الرئيسية: أسماء الأدوية المتاحة فقط كنصوص (مطابقة لطريقة العرض الأصلية)
  const displayedMeds = Array.isArray(meds)
    ? meds.filter((m) => m && typeof m.id !== "undefined" && availableMedsMap[m.id])
    : [];
  const displayedMedNames = displayedMeds.map((m) => String(m?.Name ?? ""));

  return (
    <>
      {/* سهم الرجوع */}
      <TouchableOpacity
        style={styles.backArrow}
        onPress={() => navigation.goBack()}
      >
        <Ionicons
          name={I18nManager.isRTL ? "arrow-forward" : "arrow-back"}
          size={24}
          color="#000"
        />
      </TouchableOpacity>

      {/* المحتوى الرئيسي */}
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Text style={[styles.subtitle, styles.rtlText]}>
            إجمالي الأدوية: {displayedMedNames.length}
          </Text>
          <TouchableOpacity
            style={[styles.actionBtn, styles.addButton]}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="medkit-outline" size={20} color="#fff" />
            <Text style={styles.addButtonText}>إدارة الأدوية</Text>
          </TouchableOpacity>
        </View>

        {displayedMedNames.length === 0 ? (
          <Text style={[styles.noMedsText, styles.rtlText]}>
            لا توجد أدوية متوفرة حالياً
          </Text>
        ) : (
          <FlatList
            data={Array.isArray(displayedMedNames) ? displayedMedNames : []}
            keyExtractor={(item, index) =>
              typeof item === "string" && item ? `${item}__${index}` : String(index)
            }
            renderItem={({ item }) => (
              <View style={styles.medItem}>
                <Ionicons
                  name="bandage-outline"
                  size={24}
                  color="#4CAF50"
                  style={{ marginLeft: 8 }}
                />
                <Text style={[styles.medName, styles.rtlText]}>{String(item ?? "")}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          />
        )}

        {/* مودال إدارة الأدوية */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, styles.rtlText]}>
                إدارة الأدوية
              </Text>
              <FlatList
                data={Array.isArray(meds) ? meds : []}
                keyExtractor={(item, index) =>
                  typeof item?.id !== "undefined" && item?.id !== null
                    ? String(item.id)
                    : `med__${index}`
                }
                renderItem={({ item }) => (
                  <View style={styles.switchRow}>
                    <Text style={[styles.patientNameText, styles.rtlText]}>
                      {String(item?.Name ?? "")}
                    </Text>
                    <Switch
                      value={!!availableMedsMap?.[item?.id]}
                      onValueChange={() => handleToggle(item)}
                    />
                  </View>
                )}
                style={{ marginBottom: 20, maxHeight: 300 }}
              />
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons
                  name="close-circle"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.btnText}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

// ====== نفس الستايل تمامًا بدون أي تعديل ======
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 20 : 20,
  },
  rtlText: {
    writingDirection: "rtl",
    textAlign: "right",
  },
  backArrow: {
    top: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 0,
    left: 16,
    zIndex: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
  },
  headerSection: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#444",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: Platform.select({ ios: 12, android: 10 }),
    paddingHorizontal: 14,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 6,
  },
  noMedsText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
    fontSize: 16,
  },
  medItem: {
    flexDirection: "row-reverse",
    backgroundColor: "#FFF",
    padding: Platform.select({ ios: 16, android: 14 }),
    borderRadius: 10,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    alignItems: "center",
  },
  medName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  switchRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  patientNameText: {
    fontSize: 15,
    color: "#444",
    width: "80%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    marginTop: Platform.select({ ios: 100, android: 60 }),
    marginHorizontal: 20,
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 20,
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#F44336",
  },
});
