// sami
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import RatingStars from "../componentsHealth/RatingStars";
import ENDPOINTS from "../samiendpoint";
import {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from "../style/theme";

const primary = colors.primary;

// clinic data
const MOCK_CLINICS = [
  { id: 1, name: "Main Clinic" },
  { id: 2, name: "سعير" },
  { id: 3, name: "عيادة السلام" },
];

const FeedbackScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  // form state
  const [appValue, setAppValue] = useState(0);
  const [comment, setComment] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [patientName, setPatientName] = useState("مريض");

  // clinic info
  const clinicId = 1;
  const clinicName = MOCK_CLINICS.find((c) => c.id === clinicId)?.name || "عيادة الصحة";

  // reset form and load patient data on focus
  useEffect(() => {
    if (isFocused) {
      setAppValue(0);
      setComment("");
      loadPatientData();
    }
  }, [isFocused]);

  const loadPatientData = async () => {
    try {
      const id = await AsyncStorage.getItem("patientId");
      if (id) {
        setPatientId(parseInt(id, 10));
        const response = await axios.get(`${ENDPOINTS.BASE_URL}/patient/dashboard/${id}`);
        setPatientName(response.data.full_name || "مريض");
      }
    } catch (error) {
      console.error("Error loading patient data:", error);
    }
  };

  // API call
  const submitRating = async ({ patientId, patientName, clinicId, clinicName, appRating, comment }) => {
    const response = await axios.post(ENDPOINTS.ratingsSubmit, {
      patient_id: patientId,
      patient_name: patientName || "مستخدم",
      clinic_id: clinicId || 1,
      clinic_name: clinicName || "عيادة الصحة",
      app_rating: Number(appRating) || 0,
      clinic_rating: 0,
      comment: comment || "",
    });
    return response.data;
  };

  // submit form
  const handleSubmit = async () => {
    if (!appValue) {
      Alert.alert("تنبيه", "الرجاء اختيار تقييم للتطبيق");
      return;
    }

    if (!patientId) {
      Alert.alert("خطأ", "لم يتم العثور على معرف المريض");
      return;
    }

    try {
      const result = await submitRating({
        patientId,
        patientName,
        clinicId,
        clinicName,
        appRating: appValue,
        clinicRating: 0,
        comment,
      });

      if (result.success) {
        Alert.alert("تم", result.message || "تم إرسال تقييمك بنجاح");
        navigation.goBack();
      } else {
        Alert.alert(
          "تنبيه",
          result.message || "لا يمكن إرسال تقييم جديد الآن"
        );
      }
    } catch (e) {
      Alert.alert("خطأ", "تعذر إرسال التقييم");
      console.error("Error submitting rating:", e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={primary} />
          </TouchableOpacity>
          <Text style={styles.title}>تقييم جودة الخدمات</Text>
          <View style={styles.topBarSpacer} />
        </View>

        <View style={styles.panel}>
          <Text style={styles.label}>تقييم التطبيق</Text>
          <View style={styles.starsRow}>
            <RatingStars value={appValue} onChange={setAppValue} size={28} />
            {appValue ? (
              <Text style={styles.valueText}>{appValue} / 5</Text>
            ) : null}
          </View>
        </View>

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
            placeholderTextColor={colors.textSecondary}
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
          <Ionicons
            name="send"
            size={18}
            color={colors.buttonPrimaryText}
            style={styles.submitIcon}
          />
          <Text style={styles.submitText}>إرسال التقييم</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  container: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  topBar: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...shadows.small,
  },
  backBtn: {
    padding: spacing.xs,
  },
  title: {
    color: primary,
    fontSize: typography.bodyMd,
    fontWeight: "700",
    textAlign: "center",
  },
  topBarSpacer: {
    width: 24,
  },
  panel: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...shadows.small,
  },
  label: {
    fontSize: typography.bodySm,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: "right",
  },
  starsRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  valueText: {
    color: colors.textPrimary,
    fontWeight: "700",
    fontSize: typography.bodyMd,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    minHeight: 110,
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    textAlignVertical: "top",
    writingDirection: "rtl",
  },
  submitBtn: {
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    backgroundColor: colors.buttonPrimary ?? primary,
    borderRadius: radii.lg,
    paddingVertical: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row-reverse",
    ...shadows.medium,
  },
  submitIcon: {
    marginLeft: spacing.xs,
  },
  submitText: {
    color: colors.buttonPrimaryText,
    fontWeight: "700",
    fontSize: typography.bodyMd,
  },
});
