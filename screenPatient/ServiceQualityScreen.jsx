// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RatingStars from "../componentsHealth/RatingStars";
import EmptyState from "../componentsHealth/EmptyState";
import Tag from "../componentsHealth/Tag";
import {
  getPublicRatings,
  getAggregates,
  submitRating,
  canSubmitRatingThisMonth,
  getCurrentPatientClinicId,
} from "../utils/ratings";

const primary = "#00b29c";

export default function ServiceQualityScreen() {
  const navigation = useNavigation();

  // حالة البيانات العامة
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [aggregates, setAggregates] = useState({
    appAverage: 0,
    clinicAverage: 0,
    count: 0,
  });

  // حالة نموذج الإرسال
  const [appRating, setAppRating] = useState(0);
  const [clinicRating, setClinicRating] = useState(0);
  // لم يعد المريض يختار العيادة يدوياً؛ يتم تحديدها تلقائياً
  const [selectedClinic] = useState(getCurrentPatientClinicId());
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // جلب البيانات عند التحميل
  useEffect(() => {
    setLoading(true);
    Promise.all([getPublicRatings({ limit: 30 }), getAggregates()])
      .then(([list, aggr]) => {
        setItems(list);
        setAggregates(aggr);
      })
      .finally(() => setLoading(false));
  }, []);

  // إرسال التقييم الحالي
  const handleSubmit = useCallback(() => {
    if (!appRating && !clinicRating) {
      Alert.alert("تنبيه", "يرجى اختيار تقييم للتطبيق أو العيادة على الأقل.");
      return;
    }
    // تحقق من السماح بالتقييم مرة كل شهر
    const patientId = "current";
    const check = canSubmitRatingThisMonth(patientId);
    if (!check.allowed) {
      const dt = check.nextEligible
        ? new Date(check.nextEligible).toLocaleDateString("ar-EG")
        : "";
      Alert.alert("تنبيه", `يمكنك إرسال تقييم جديد بعد: ${dt}`);
      return;
    }

    setSubmitting(true);
    submitRating({
      patientId,
      patientName: "مستخدم",
      clinicId: selectedClinic,
      clinicName: undefined,
      appRating,
      clinicRating,
      comment,
    })
      .then(() =>
        Promise.all([getPublicRatings({ limit: 30 }), getAggregates()])
      )
      .then(([list, aggr]) => {
        setItems(list);
        setAggregates(aggr);
        setAppRating(0);
        setClinicRating(0);
        setComment("");
        Alert.alert("تم", "تم إرسال تقييمك بنجاح.");
      })
      .finally(() => setSubmitting(false));
  }, [appRating, clinicRating, selectedClinic, comment]);

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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* شريط علوي */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>جودة الخدمة</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* ملخص سريع */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>تقييم التطبيق (عام)</Text>
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
          <Text style={styles.summaryTitle}>تقييم العيادات (عام)</Text>
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

      {/* نموذج إضافة التقييم */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>أضف تقييمك</Text>
        <View style={styles.formRow}>
          <Text style={styles.label}>تقييم التطبيق</Text>
          <RatingStars value={appRating} onChange={setAppRating} size={24} />
        </View>
        <View style={styles.formRow}>
          <Text style={styles.label}>تقييم العيادة</Text>
          <RatingStars
            value={clinicRating}
            onChange={setClinicRating}
            size={24}
          />
        </View>

        {/* لا حاجة لاختيار العيادة؛ يتم تحديدها تلقائياً من حساب المريض */}

        <Text style={styles.label}>ملاحظاتك</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="اكتب ملاحظتك هنا..."
          style={styles.textarea}
          multiline
          textAlign="right"
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Ionicons
            name="send"
            color="#fff"
            size={18}
            style={{ marginLeft: 6, transform: [{ rotate: "180deg" }] }}
          />
          <Text style={styles.submitText}>
            {submitting ? "...إرسال" : "إرسال التقييم"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* قائمة التقييمات العامة */}
      <View style={{ flex: 1 }}>
        {items.length === 0 ? (
          <EmptyState
            icon="chatbubbles-outline"
            title="لا توجد تقييمات بعد"
            subtitle="كن أول من يشارك تجربته"
          />
        ) : (
          <FlatList
            data={items}
            keyExtractor={(it) => it.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </KeyboardAvoidingView>
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
  formCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 16,
    marginBottom: 10,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
    textAlign: "right",
  },
  formRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  formRowColumn: {
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 6,
    textAlign: "right",
  },
  rowCenter: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  rowWrap: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#EFF6FF",
    marginRight: 6,
    marginBottom: 6,
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
  textarea: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  submitBtn: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primary,
    paddingVertical: 12,
    borderRadius: 10,
  },
  submitText: {
    color: "#fff",
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginHorizontal: 16,
    marginTop: 10,
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
