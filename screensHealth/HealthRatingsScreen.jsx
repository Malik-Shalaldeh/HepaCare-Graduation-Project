// شاشة مبسطة لعرض تقييمات التطبيق فقط

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Platform } from "react-native";
import { getAllRatings, getAggregates } from "../utils/ratings";

const primary = "#00b29c";

export default function HealthRatingsScreen() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [aggregates, setAggregates] = useState({ appAverage: 0, count: 0 });

  useEffect(() => {
    setLoading(true);
    Promise.all([getAllRatings(), getAggregates()])
      .then(([list, aggs]) => {
        setItems(list);
        setAggregates({ appAverage: aggs.appAverage, count: aggs.count });
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {/* ملخص بسيط */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>متوسط تقييم التطبيق</Text>
          <Text style={styles.summaryValue}>{aggregates.appAverage} / 5</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>عدد التقييمات</Text>
          <Text style={styles.summaryValue}>{aggregates.count}</Text>
        </View>
      </View>

      {/* القائمة */}
      <FlatList
        data={items}
        keyExtractor={(it) => it.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        refreshing={loading}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.patientName}>{item.patientName}</Text>
              <Text style={styles.smallLabel}>
                التقييم: {item.appRating} / 5
              </Text>
            </View>
            {item.comment ? (
              <View style={styles.commentBox}>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            ) : null}
            <Text style={styles.dateText}>
              {new Date(item.createdAt).toLocaleString("ar-EG")}
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text
            style={{ textAlign: "center", color: "#64748B", marginTop: 24 }}
          >
            لا توجد تقييمات
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF9" },
  summaryRow: {
    flexDirection: "row-reverse",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 6,
    marginBottom: 10,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  summaryTitle: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 6,
    textAlign: "right",
  },
  summaryValue: { fontSize: 16, color: "#0F172A", fontWeight: "700" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  patientName: { fontSize: 16, color: "#0F172A", fontWeight: "700" },
  smallLabel: { fontSize: 12, color: "#475569" },
  commentBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  commentText: { fontSize: 14, color: "#1F2937", textAlign: "right" },
  dateText: { marginTop: 8, color: "#64748B", fontSize: 12, textAlign: "left" },
});
