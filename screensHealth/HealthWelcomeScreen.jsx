import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import { useNavigation } from "@react-navigation/native";
import theme from "../style/theme";

const primary = theme.colors.primary;
const accent = theme.colors.accent;
const textColor = theme.colors.textSecondary;

export default function HealthWelcomeScreen() {
  const navigation = useNavigation();

  const today = new Date();
  const months = [
    "يناير",
    "فبراير",
    "مارس",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
  ];
  const formattedDate = `${today.getDate()} ${
    months[today.getMonth()]
  } ${today.getFullYear()}`;

  return (
    <ScreenWithDrawer title="لوحة التحكم">
      <View style={styles.header}>
        <Text style={styles.headerText}>Hepacare</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.card}>
          <Ionicons
            name="happy-outline"
            size={40}
            color={accent}
            style={styles.icon}
          />
          <View>
            <Text style={styles.title}>اهلا مشرف الصحة 👋</Text>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.overviewButton}
          onPress={() =>
            (navigation.getParent?.() || navigation).navigate("نظرة عامة")
          }
          activeOpacity={0.85}
        >
          <View style={styles.overviewIconWrapper}>
            <Ionicons name="stats-chart-outline" size={22} color={primary} />
          </View>

          <View style={styles.overviewTextWrapper}>
            <Text style={styles.overviewTitle}>نظرة عامة</Text>
            <Text style={styles.overviewSubtitle}>
              عرض توزيع المرضى حسب المحافظة
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.motivationBox}>
          <Ionicons
            name="shield-checkmark-outline"
            size={50}
            color={theme.colors.success}
            style={{ marginBottom: theme.spacing.sm }}
          />
          <Text style={styles.motivationText}>
            دورك أساسي في متابعة جودة الخدمات الصحية وتعزيز رضا المرضى
          </Text>
        </View>
      </View>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: "center",
  },
  card: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  icon: { marginEnd: theme.spacing.md },
  title: {
    fontSize: theme.typography.headingSm,
    fontWeight: "700",
    color: primary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  subtitle: {
    fontSize: theme.typography.bodyMd,
    color: textColor,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  header: {
    width: "100%",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.xl,
    ...theme.shadows.medium,
    alignItems: "center",
  },
  headerText: {
    fontSize: theme.typography.headingLg,
    fontWeight: "bold",
    color: theme.colors.buttonPrimaryText,
    letterSpacing: 3,
    fontFamily: theme.typography.fontFamily,
  },
  motivationBox: {
    width: "100%",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    alignItems: "center",
    ...theme.shadows.light,
    marginTop: theme.spacing.sm,
  },
  motivationText: {
    fontSize: theme.typography.bodyLg,
    fontWeight: "500",
    color: primary,
    textAlign: "center",
    lineHeight: theme.typography.lineHeightNormal,
    fontFamily: theme.typography.fontFamily,
  },
  overviewButton: {
    width: "100%",
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  overviewIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: theme.spacing.sm,
  },
  overviewTextWrapper: {
    flex: 1,
  },
  overviewTitle: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: "700",
    marginBottom: 2,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  overviewSubtitle: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodySm,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
});
