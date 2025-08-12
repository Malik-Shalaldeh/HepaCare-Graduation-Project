import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#00b29c";

const CITIES = [
  { id: 1, name: "القدس" },
  { id: 2, name: "رام الله" },
  { id: 3, name: "الخليل" },
  { id: 4, name: "نابلس" },
];

const MOCK_LABS = [
  {
    id: 1,
    name: "مختبر القدس",
    city_id: 1,
    address: "حي...",
    phone: "0599000000",
    email: "lab1@mail.com",
    location_url: "",
    is_accredited: true,
    is_active: true,
  },
  {
    id: 2,
    name: "مختبر الشفاء",
    city_id: 3,
    address: "",
    phone: "0599111111",
    email: "",
    location_url: "https://maps.google.com/..",
    is_accredited: false,
    is_active: true,
  },
];

const cityName = (id) => CITIES.find((c) => c.id === id)?.name || "—";

export default function LabDeleteScreen() {
  const [q, setQ] = useState("");
  const [lab, setLab] = useState(null);

  const onSearch = () => {
    if (!q.trim())
      return Alert.alert("تنبيه", "أدخل رقم المختبر أو جزء من الاسم");
    const query = q.trim().toLowerCase();
    const num = Number(query);
    let found = null;
    if (!Number.isNaN(num)) found = MOCK_LABS.find((l) => l.id === num);
    if (!found)
      found = MOCK_LABS.find((l) => l.name.toLowerCase().includes(query));
    setLab(found || null);
    if (!found) Alert.alert("غير موجود", "لا يوجد مختبر مطابق");
  };

  const onDelete = () => {
    if (!lab) return;
    Alert.alert("حذف مختبر", `هل تريد حذف "${lab.name}" (ID: ${lab.id})؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "حذف",
        style: "destructive",
        onPress: () => {
          // TODO: DELETE /labs/:id
          Alert.alert("تم الحذف", `تم حذف: ${lab.name}`);
          setLab(null);
          setQ("");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            padding: 16,
            paddingBottom: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.label}>ابحث عن المختبر (بالرقم أو الاسم)</Text>
          <View style={styles.row}>
            <Ionicons name="search-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.input}
              placeholder="مثال: 2 أو مختبر الشفاء"
              placeholderTextColor="#94A3B8"
              value={q}
              onChangeText={setQ}
              textAlign="right"
              returnKeyType="search"
              onSubmitEditing={onSearch}
            />
            <TouchableOpacity
              onPress={onSearch}
              activeOpacity={0.85}
              style={styles.iconBtn}
            >
              <Ionicons name="search" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {lab && (
            <>
              <View style={styles.card}>
                <Ionicons
                  name="flask-outline"
                  size={24}
                  color={PRIMARY}
                  style={{ marginLeft: 6 }}
                />
                <View style={{ flex: 1, alignItems: "flex-end" }}>
                  <Text style={styles.cardTitle}>{lab.name}</Text>
                  <Text style={styles.cardMeta}>
                    ID: {lab.id} — المدينة: {cityName(lab.city_id)}
                  </Text>
                  <Text style={styles.cardMeta}>
                    الهاتف: {lab.phone || "—"} — البريد: {lab.email || "—"}
                  </Text>
                  <Text style={styles.cardMeta}>
                    المعتمد: {lab.is_accredited ? "نعم" : "لا"} — فعال:{" "}
                    {lab.is_active ? "نعم" : "لا"}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={onDelete}
                activeOpacity={0.9}
                style={styles.deleteBtn}
              >
                <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                <Text style={styles.deleteText}>حذف المختبر</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  label: {
    color: "#0F172A",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    alignSelf: "flex-end",
    marginBottom: 6,
    marginTop: 8,
    width: "88%",
  },
  row: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
    width: "88%",
  },
  input: { flex: 1, color: "#0F172A", fontSize: 15, textAlign: "right" },
  iconBtn: {
    backgroundColor: PRIMARY,
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    width: "88%",
    marginTop: 10,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginBottom: 2,
    textAlign: "right",
    width: "100%",
  },
  cardMeta: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "right",
    width: "100%",
  },

  deleteBtn: {
    backgroundColor: "#ef4444",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 12,
    minWidth: 170,
  },
  deleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    marginStart: 6,
  },
});
