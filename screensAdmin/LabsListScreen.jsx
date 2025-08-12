import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  Linking,
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
  {
    id: 3,
    name: "مختبر النجاح",
    city_id: 4,
    address: "شارع...",
    phone: "",
    email: "",
    location_url: "",
    is_accredited: true,
    is_active: false,
  },
];

const cityName = (id) => CITIES.find((c) => c.id === id)?.name || "—";

export default function LabsListScreen() {
  const [q, setQ] = useState("");
  const [onlyAccredited, setOnlyAccredited] = useState(false);
  const [onlyActive, setOnlyActive] = useState(false);

  const data = useMemo(() => {
    const s = q.trim().toLowerCase();
    return MOCK_LABS.filter((l) => {
      if (onlyAccredited && !l.is_accredited) return false;
      if (onlyActive && !l.is_active) return false;
      if (!s) return true;
      return (
        l.name.toLowerCase().includes(s) ||
        String(l.id).includes(s) ||
        (l.phone || "").toLowerCase().includes(s) ||
        (l.email || "").toLowerCase().includes(s) ||
        (l.address || "").toLowerCase().includes(s) ||
        cityName(l.city_id).toLowerCase().includes(s)
      );
    });
  }, [q, onlyAccredited, onlyActive]);

  const openLocation = (url) => url && Linking.openURL(url).catch(() => {});

  const Header = (
    <View style={{ alignItems: "center" }}>
      <Text style={styles.label}>ابحث في المختبرات</Text>
      <View style={styles.row}>
        <Ionicons name="search-outline" size={18} color={PRIMARY} />
        <TextInput
          style={styles.input}
          placeholder="اسم، رقم، مدينة، هاتف، بريد.."
          placeholderTextColor="#94A3B8"
          value={q}
          onChangeText={setQ}
          textAlign="right"
          returnKeyType="search"
        />
      </View>

      <View style={styles.filters}>
        <View style={styles.filterItem}>
          <Switch value={onlyAccredited} onValueChange={setOnlyAccredited} />
          <Text style={styles.filterText}>فقط المعتمد</Text>
        </View>
        <View style={styles.filterItem}>
          <Switch value={onlyActive} onValueChange={setOnlyActive} />
          <Text style={styles.filterText}>فقط الفعّال</Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons
        name="flask-outline"
        size={24}
        color={PRIMARY}
        style={{ marginLeft: 6 }}
      />
      <View style={{ flex: 1, alignItems: "flex-end" }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardMeta}>
          ID: {item.id} — المدينة: {cityName(item.city_id)}
        </Text>
        {!!item.address && (
          <Text style={styles.cardMeta}>العنوان: {item.address}</Text>
        )}
        <Text style={styles.cardMeta}>
          الهاتف: {item.phone || "—"} — البريد: {item.email || "—"}
        </Text>
        <View style={styles.badges}>
          <View
            style={[
              styles.badge,
              item.is_accredited ? styles.badgeYes : styles.badgeNo,
            ]}
          >
            <Ionicons
              name={item.is_accredited ? "checkmark-circle" : "close-circle"}
              size={14}
              color="#fff"
            />
            <Text style={styles.badgeText}>معتمد</Text>
          </View>
          <View
            style={[
              styles.badge,
              item.is_active ? styles.badgeYes : styles.badgeNo,
            ]}
          >
            <Ionicons
              name={item.is_active ? "checkmark-circle" : "close-circle"}
              size={14}
              color="#fff"
            />
            <Text style={styles.badgeText}>فعال</Text>
          </View>
          {!!item.location_url && (
            <TouchableOpacity
              style={[styles.badge, styles.badgeLink]}
              onPress={() => openLocation(item.location_url)}
            >
              <Ionicons name="navigate-outline" size={14} color="#fff" />
              <Text style={styles.badgeText}>الموقع</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        ListHeaderComponent={Header}
        renderItem={renderItem}
        contentContainerStyle={{
          paddingTop: 6,
          paddingBottom: 20,
          alignItems: "center",
        }}
        ListEmptyComponent={
          <Text style={{ marginTop: 16, color: "#64748B", fontWeight: "600" }}>
            لا توجد نتائج مطابقة
          </Text>
        }
        keyboardShouldPersistTaps="handled"
      />
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
    width: "88%",
  },
  input: { flex: 1, color: "#0F172A", fontSize: 15, textAlign: "right" },
  filters: {
    width: "88%",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 6,
  },
  filterItem: { flexDirection: "row-reverse", alignItems: "center", gap: 8 },
  filterText: { color: "#0F172A", fontWeight: "700" },

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

  badges: {
    marginTop: 6,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 6,
  },
  badgeYes: { backgroundColor: "#10B981" },
  badgeNo: { backgroundColor: "#EF4444" },
  badgeLink: { backgroundColor: PRIMARY },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "800" },
});
