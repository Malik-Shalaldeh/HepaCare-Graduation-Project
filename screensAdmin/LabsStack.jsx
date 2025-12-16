// LabsStack.jsx
import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from '../style/theme';
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const primary = colors.primary;
const dark = colors.secondary;

export default function LabsStack({ navigation }) {
  return (
      <View style={{ flex: 1 }}>

      {/* خلفية الشرط عشان يظهر اللون */}
      <View style={{
        height: Platform.OS === "android" ? StatusBar.currentHeight : 44, // 44 iOS تقريباً
        backgroundColor: theme.colors.primary
      }} />
      
      {/* StatusBar */}
      <StatusBar
        barStyle="light-content"
        translucent={false}
        backgroundColor={theme.colors.primary}
      />


        <View style={styles.container}>
          <Text style={styles.title}>ادارة سجلات المختبرات</Text>

          {/* إضافة مختبر */}
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimary]}
            onPress={() => navigation.navigate("LabAdd")}
            activeOpacity={0.9}
          >
            <View style={styles.btnContent}>
              <Ionicons name="add-circle-outline" size={22} color="#fff" />
              <Text style={styles.btnText}>إضافة مختبر</Text>
            </View>
          </TouchableOpacity>

          {/* حذف مختبر */}
          <TouchableOpacity
            style={[styles.btn, styles.btnDark]}
            onPress={() => navigation.navigate("LabDelete")}
            activeOpacity={0.9}
          >
            <View style={styles.btnContent}>
              <Ionicons name="trash-outline" size={22} color="#fff" />
              <Text style={styles.btnText}>حذف مختبر</Text>
            </View>
          </TouchableOpacity>

          {/* عرض المختبرات */}
          <TouchableOpacity
            style={[styles.btn, styles.btnOutline]}
            onPress={() => navigation.navigate("LabsList")}
            activeOpacity={0.9}
          >
            <View style={styles.btnContent}>
              <Ionicons name="list-outline" size={22} color={primary} />
              <Text style={[styles.btnText, { color: primary }]}>
                عرض المختبرات
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  title: {
    color: dark,
    fontSize: theme.typography.headingMd,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  btn: {
    borderRadius: radii.lg,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    ...shadows.light,
  },
  btnPrimary: {
    backgroundColor: primary,
  },
  btnDark: {
    backgroundColor: dark,
  },
  btnOutline: {
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: primary,
  },
  btnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  btnText: {
    color: "#fff",
    fontSize: typography.bodyLg,
    fontFamily: typography.fontFamily,
    fontWeight: "700",
  },
});
