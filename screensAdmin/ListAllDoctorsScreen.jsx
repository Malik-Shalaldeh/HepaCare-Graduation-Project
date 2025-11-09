import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import ENDPOINTS from "../malikEndPoint";

export default function AllDoctorsScreen() {
  const [search, setSearch] = useState("");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await axios.get(ENDPOINTS.ADMIN.DOCTORS);
        setDoctors(res.data);
      } catch (err) {
        console.error("خطأ في جلب الأطباء:", err);
      }
    };
    fetchDoctors();
  }, []);

  const results = doctors.filter((d) => {
    const query = search.trim();
    if (!query) return true;
    const nameMatch = d.name && d.name.includes(query);
    const idMatch = d.id && d.id.toString().includes(query);
    const clinicMatch = d.clinic && d.clinic.includes(query);
    return nameMatch || idMatch || clinicMatch;
  });

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons
        name="medkit-outline"
        size={20}
        color="#00b29c"
        style={styles.cardIcon}
      />
      <View style={styles.infoBox}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>رقم الهوية: {item.id}</Text>
        <Text style={styles.meta}>رقم الهاتف: {item.phone}</Text>
        <Text style={styles.meta}>العيادة: {item.clinic}</Text>
        <Text
          style={[
            styles.status,
            { color: item.active ? "#00b29c" : "#D32F2F" },
          ]}
        >
          {item.active ? "مفعّل" : "غير مفعّل"}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={18}
          color="#6B7280"
          style={{ marginLeft: 6 }}
        />
        <TextInput
          style={styles.input}
          placeholder="ابحث بالاسم أو رقم الهوية أو العيادة"
          placeholderTextColor="#9AA4AF"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
      </View>
      <FlatList
        data={results}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.empty}>لا توجد نتائج مطابقة.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    alignItems: "center",
  },
  searchRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
    width: "85%",
  },
  input: {
    flex: 1,
    color: "#2C3E50",
    fontSize: 14,
    textAlign: "right",
  },
  listContainer: {
    paddingTop: 4,
    paddingBottom: 16,
    rowGap: 10,
    width: "100%",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E6E8EC",
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 8,
    width: "85%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardIcon: { marginLeft: 6 },
  infoBox: { flex: 1, alignItems: "flex-end" },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#2C3E50",
    marginBottom: 2,
    textAlign: "right",
    width: "100%",
  },
  meta: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "right",
    width: "100%",
  },
  status: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "right",
    width: "100%",
  },
  empty: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 16,
    fontSize: 14,
  },
});
