import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import RatingStars from "../componentsHealth/RatingStars";
import {
  submitRating,
  getCurrentPatientClinicId,
  MOCK_CLINICS,
} from "../utils/ratings";

const primary = "#00b29c";

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const [appValue, setAppValue] = useState(0);
  const [comment, setComment] = useState("");
  const clinicId = getCurrentPatientClinicId();
  const clinicName =
    MOCK_CLINICS.find((c) => c.id === clinicId)?.name || "عيادة الصحة";

  const handleSubmit = async () => {
    if (!appValue) {
      Alert.alert("تنبيه", "الرجاء اختيار تقييم للتطبيق");
      return;
    }
    try {
      await submitRating({
        patientName: "مريض",
        clinicId,
        clinicName,
        appRating: appValue,
        clinicRating: 0,
        comment,
      });
      Alert.alert("تم", "تم إرسال تقييمك بنجاح");
      navigation.goBack();
    } catch (e) {
      Alert.alert("خطأ", "تعذر إرسال التقييم");
    }
  };

  return (
    <View style={styles.container}>
      {/* شريط علوي بسيط */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={primary} />
        </TouchableOpacity>
        <Text style={styles.title}>تقييم جودة الخدمات</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* تقييم التطبيق بالنجوم */}
      <View style={styles.panel}>
        <Text style={[styles.label, { marginBottom: 8 }]}>تقييم التطبيق</Text>
        <View style={styles.starsRow}>
          <RatingStars value={appValue} onChange={setAppValue} size={28} />
          {appValue ? (
            <Text style={styles.valueText}>{appValue} / 5</Text>
          ) : null}
        </View>
      </View>

      {/* خانة الملاحظات */}
      <View style={styles.panel}>
        <Text style={styles.label}>ملاحظاتك</Text>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="اكتب ملاحظتك هنا (اختياري)"
          style={styles.input}
          multiline
          numberOfLines={4}
          textAlign="right"
        />
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        <Ionicons
          name="send"
          size={18}
          color="#fff"
          style={{ marginLeft: 6 }}
        />
        <Text style={styles.submitText}>إرسال التقييم</Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6FAF9" },
  topBar: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: { padding: 4 },
  title: { color: primary, fontSize: 16, fontWeight: "700" },
  panel: {
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    textAlign: "right",
  },
  starsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: { color: "#111827", fontWeight: "700" },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    minHeight: 110,
  },
  submitBtn: {
    marginTop: 16,
    backgroundColor: primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    marginHorizontal: 16,
  },
  submitText: { color: "#fff", fontWeight: "700" },
});
