// sami - Visits Summary Screen (Malik-style: simple, axios, focus refresh)

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Platform, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import ScreenWithDrawer from "./ScreenWithDrawer";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";


const AI_MODEL = "Hepa_care_version_20:latest";

const VisitsSummaryScreen = ({ route }) => {
  const { patientId, patientName } = route.params || {};
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const topInset = (insets?.top ?? 0) || (Platform.OS === "android" ? StatusBar.currentHeight ?? 0 : 0);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isFocused) {
      loadSummary();
    }
  }, [isFocused]);

  const loadSummary = async () => {
    if (!patientId) {
      setError("لا يوجد معرف للمريض.");
      return;
    }

    try {
      setLoading(true);
      setSummary("");
      setError(null);
      const ai_respons1 = await axios.get(ENDPOINTS.aiUrl);
      const AI_URL = ai_respons1.data?.ai_url;
      if (!AI_URL) {
        throw new Error("عندك مشكلة مع سيرفر الذكاء");
      }

      const visitsResponse = await axios.get(ENDPOINTS.visitsHistory, {
        params: { patient_id: patientId },
      });

      const visits = Array.isArray(visitsResponse.data) ? visitsResponse.data : [];

      const visitsPayload = visits.map((visit) => ({
        id: visit.id,
        date: visit.date,
        time: visit.time,
        doctor: visit.doctorName || "",
        condition: visit.condition || "",
        adherence: visit.adherence || "",
        notes: visit.notes || "",
        psychosocial: visit.psychosocial || "",
        summary: visit.summary || "",
      }));

      const dataForAi = {
        patient: { id: patientId, name: patientName || "غير معروف" },
        visits: visitsPayload,
      };

      const prompt = [
        "البيانات التالية:",
        JSON.stringify(dataForAi, null, 2),
        "قدّم ملخصاً طبياً بالعربية وفق التعليمات المسبقة.",
      ].join("\n\n");

      const aiResponse = await axios.post(AI_URL, {
        model: AI_MODEL,
        prompt,
        stream: false,
      });

      const text = aiResponse.data?.response?.trim();

      if (!text) {
        throw new Error("الرد من الخادم فارغ.");
      }

      setSummary(text);
    } catch (err) {
      console.error("خطأ في إنشاء ملخص الزيارات:", err);
      setError(err?.message ?? "حدث خطأ أثناء توليد الملخص، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWithDrawer title="ملخص الزيارات">
      <View style={styles.container}>
        <View style={styles.contentWrapper}>
          <TouchableOpacity
            style={[styles.backButton, { marginTop: topInset + spacing.sm }]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>

          <View style={styles.patientBox}>
            <Text style={styles.patientLabel}>المريض:</Text>
            <Text style={styles.patientName}>{patientName || "غير معروف"}</Text>
          </View>

          {loading && (
            <View style={styles.centerBox}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.infoText}>جاري تحليل الزيارات...</Text>
            </View>
          )}

          {error && (
            <View style={styles.centerBox}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={loadSummary}>
                <Text style={styles.retryText}>إعادة المحاولة</Text>
              </TouchableOpacity>
            </View>
          )}

          {!loading && !error && summary && (
            <ScrollView nestedScrollEnabled={true} style={styles.scrollArea} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.lg }]}>
              <Text style={styles.summaryText}>{summary}</Text>
            </ScrollView>
          )}
        </View>
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.lg,
    backgroundColor: 'transparent',
  },
  contentWrapper: {
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    ...shadows.light,
  },
  patientBox: {
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  patientLabel: {
    fontSize: typography.bodySm,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: "right",
  },
  patientName: {
    fontSize: typography.headingSm,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    textAlign: "right",
    color: colors.primary,
  },
  centerBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  infoText: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  errorText: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    color: colors.danger,
    textAlign: "center",
    marginBottom: spacing.sm,
  },
  retryButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: colors.buttonPrimary,
    borderRadius: radii.md,
    ...shadows.light,
  },
  retryText: {
    color: colors.buttonPrimaryText,
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
  },
  scrollArea: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    ...shadows.light,
  },
  scrollContent: {
    padding: spacing.md,
  },
  summaryText: {
    fontSize: typography.bodyMd,
    fontFamily: typography.fontFamily,
    lineHeight: 26,
    textAlign: "right",
    color: colors.textPrimary,
  },
});

export default VisitsSummaryScreen;
