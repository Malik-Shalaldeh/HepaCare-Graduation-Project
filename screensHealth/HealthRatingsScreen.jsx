// sami

import React, { useMemo, useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import RatingStars from "../componentsHealth/RatingStars";
import EmptyState from "../componentsHealth/EmptyState";
import Tag from "../componentsHealth/Tag";
import { getAllRatings, filterRatings, MOCK_CLINICS } from "../utils/ratings";

const primary = "#00b29c";

export default function HealthRatingsScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [clinicId, setClinicId] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [aggregates, setAggregates] = useState({
    appAverage: 0,
    clinicAverage: 0,
    count: 0,
  });

  // جلب البيانات الأولية
  useEffect(() => {
    setLoading(true);
    getAllRatings()
      .then((data) => {
        setItems(data);
        // حساب التجميعات باستخدام فلترة بدون شروط
        filterRatings({}).then((res) =>
          setAggregates({
            appAverage: res.appAverage,
            clinicAverage: res.clinicAverage,
            count: res.count,
          })
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const applyFilters = useCallback(() => {
    setLoading(true);
    filterRatings({
      clinicId,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((res) => {
        setItems(res.items);
        setAggregates({
          appAverage: res.appAverage,
          clinicAverage: res.clinicAverage,
          count: res.count,
        });
      })
      .finally(() => setLoading(false));
  }, [clinicId, startDate, endDate]);

  const clearFilters = useCallback(() => {
    setClinicId("all");
    setStartDate("");
    setEndDate("");
    applyFilters();
  }, [applyFilters]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.patientName}>{item.patientName}</Text>
        <Tag text={item.clinicName} />
      </View>
      <View style={styles.rowBetween}>
        <View style={styles.rowCenter}>
          <Ionicons
            name="apps-outline"
            color={primary}
            size={18}
            style={{ marginRight: 6 }}
          />
          <RatingStars value={item.appRating} size={18} disabled />
          <Text style={styles.smallLabel}>تقييم التطبيق</Text>
        </View>
        <View style={styles.rowCenter}>
          <Ionicons
            name="medkit-outline"
            color={primary}
            size={18}
            style={{ marginRight: 6 }}
          />
          <RatingStars value={item.clinicRating} size={18} disabled />
          <Text style={styles.smallLabel}>تقييم العيادة</Text>
        </View>
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
  );

  return (
    <View style={styles.container}>
      {/* شريط علوي بسيط */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>التقييمات</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* شريط فلاتر */}
      <View style={styles.filters}>
        <View style={styles.filterRow}>
          <View style={styles.filterField}>
            <Text style={styles.label}>العيادة</Text>
            <View style={styles.selectFake}>
              <Text style={styles.selectText} numberOfLines={1}>
                {clinicId === "all"
                  ? "الكل"
                  : MOCK_CLINICS.find((c) => c.id === clinicId)?.name || "—"}
              </Text>
              {/* لاحقاً استبدالها بـ Picker */}
            </View>
            <View style={styles.rowBetween}>
              {["all", ...MOCK_CLINICS.map((c) => c.id)].map((id) => (
                <TouchableOpacity
                  key={id}
                  style={[styles.chip, clinicId === id && styles.chipActive]}
                  onPress={() => setClinicId(id)}
                >
                  <Text
                    style={[
                      styles.chipText,
                      clinicId === id && styles.chipTextActive,
                    ]}
                  >
                    {id === "all"
                      ? "الكل"
                      : MOCK_CLINICS.find((c) => c.id === id)?.name.split(
                          " - "
                        )[1] || "—"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterField}>
            <Text style={styles.label}>من تاريخ</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
              style={styles.input}
            />
          </View>
          <View style={styles.filterField}>
            <Text style={styles.label}>إلى تاريخ</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={applyFilters}
            disabled={loading}
          >
            <Ionicons
              name="funnel-outline"
              color="#fff"
              size={18}
              style={{ marginLeft: 6 }}
            />
            <Text style={styles.primaryBtnText}>
              {loading ? "...تطبيق" : "تطبيق الفلاتر"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryBtn}
            onPress={clearFilters}
            disabled={loading}
          >
            <Ionicons
              name="refresh"
              color={primary}
              size={18}
              style={{ marginLeft: 6 }}
            />
            <Text style={styles.secondaryBtnText}>إعادة ضبط</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ملخص */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>متوسط تقييم التطبيق</Text>
          <View style={styles.rowCenter}>
            <RatingStars
              value={Math.round(aggregates.appAverage)}
              size={20}
              disabled
            />
            <Text style={styles.summaryValue}>{aggregates.appAverage}</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>متوسط تقييم العيادات</Text>
          <View style={styles.rowCenter}>
            <RatingStars
              value={Math.round(aggregates.clinicAverage)}
              size={20}
              disabled
            />
            <Text style={styles.summaryValue}>{aggregates.clinicAverage}</Text>
          </View>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>عدد التقييمات</Text>
          <Text style={styles.summaryValue}>{aggregates.count}</Text>
        </View>
      </View>

      {/* القائمة */}
      {items.length === 0 ? (
        <EmptyState
          icon="star-outline"
          title="لا توجد تقييمات"
          subtitle="يمكنك تعديل الفلاتر أو الانتظار لظهور تقييمات جديدة"
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(it) => it.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6FAF9",
  },
  header: {
    height: 56,
    backgroundColor: primary,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "android" ? 0 : 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  filters: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterRow: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
  },
  filterField: {
    flex: 1,
    marginHorizontal: 6,
  },
  label: {
    fontSize: 13,
    color: "#334155",
    marginBottom: 6,
    textAlign: "right",
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    textAlign: "right",
  },
  selectFake: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 6,
  },
  selectText: {
    color: "#0F172A",
    fontSize: 14,
    textAlign: "right",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    marginHorizontal: 4,
    marginTop: 6,
  },
  chipActive: {
    backgroundColor: "#D1FAE5",
  },
  chipText: {
    color: "#1D4ED8",
    fontWeight: "600",
    fontSize: 12,
  },
  chipTextActive: {
    color: "#065F46",
  },
  actionsRow: {
    flexDirection: "row-reverse",
    marginTop: 12,
  },
  primaryBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primary,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 8,
  },
  primaryBtnText: {
    color: "#fff",
    fontWeight: "700",
  },
  secondaryBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: primary,
  },
  secondaryBtnText: {
    color: primary,
    fontWeight: "700",
  },
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
  summaryValue: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "700",
    marginLeft: 8,
  },
  rowCenter: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  rowBetween: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
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
  patientName: {
    fontSize: 16,
    color: "#0F172A",
    fontWeight: "700",
  },
  smallLabel: {
    fontSize: 12,
    color: "#475569",
    marginRight: 6,
  },
  commentBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 10,
  },
  commentText: {
    fontSize: 14,
    color: "#1F2937",
    textAlign: "right",
  },
  dateText: {
    marginTop: 8,
    color: "#64748B",
    fontSize: 12,
    textAlign: "left",
  },
});
