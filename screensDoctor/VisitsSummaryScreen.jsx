import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

import ScreenWithDrawer from "./ScreenWithDrawer";
import ENDPOINTS from "../samiendpoint";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const AI_URL = "http://192.168.1.128:11434/api/generate";
const AI_MODEL = "Hepa_care_version_17:latest";

const VisitsSummaryScreen = ({ route }) => {
  const { patientId, patientName } = route.params || {};

  const [status, setStatus] = useState("idle");
  const [summary, setSummary] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const buildPrompt = (visitsPayload) => {
    const dataForAi = {
      patient: { id: patientId, name: patientName || "غير معروف" },
      visits: visitsPayload,
    };

    return [
      "البيانات التالية:",
      JSON.stringify(dataForAi, null, 2),
      "قدّم ملخصاً طبياً بالعربية وفق التعليمات المسبقة.",
    ].join("\n\n");
  };

  const loadSummary = useCallback(async () => {
    if (!patientId) {
      setErrorMessage("لا يوجد معرف للمريض.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setSummary("");
    setErrorMessage("");

    try {
      const visitsResponse = await axios.get(ENDPOINTS.visitsHistory, {
        params: { patient_id: patientId },
      });

      const visits = Array.isArray(visitsResponse.data)
        ? visitsResponse.data
        : [];

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

      const prompt = buildPrompt(visitsPayload);

      const aiResponse = await fetch(AI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: AI_MODEL,
          prompt,
          stream: false,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error("تعذر الحصول على الملخص من الخادم الذكي.");
      }

      const aiJson = await aiResponse.json();
      const text = aiJson?.response?.trim();

      if (!text) {
        throw new Error("الرد من الخادم فارغ.");
      }

      setSummary(text);
      setStatus("done");
    } catch (error) {
      console.error("خطأ في إنشاء ملخص الزيارات:", error);
      setErrorMessage(
        error?.message ?? "حدث خطأ أثناء توليد الملخص، حاول مرة أخرى."
      );
      setStatus("error");
    }
  }, [patientId, patientName]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  return (
    <ScreenWithDrawer title="ملخص الزيارات">
      <View
        style={[styles.container, { paddingTop: insets.top + spacing.sm }]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <View style={styles.patientBox}>
          <Text style={styles.patientLabel}>المريض:</Text>
          <Text style={styles.patientName}>{patientName || "غير معروف"}</Text>
        </View>

        {status === "loading" && (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.infoText}>جاري تحليل الزيارات...</Text>
          </View>
        )}

        {status === "error" && (
          <View style={styles.centerBox}>
            <Text style={styles.errorText}>{errorMessage}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadSummary}>
              <Text style={styles.retryText}>إعادة المحاولة</Text>
            </TouchableOpacity>
          </View>
        )}

        {status === "done" && (
          <ScrollView
            nestedScrollEnabled={true}
            style={styles.scrollArea}
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + spacing.lg },
            ]}
          >
            <Text style={styles.summaryText}>{summary}</Text>
          </ScrollView>
        )}
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.backgroundLight,
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
