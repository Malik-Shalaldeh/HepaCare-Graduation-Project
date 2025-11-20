import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import { colors, spacing, radii, typography, shadows } from "../style/theme";

const PatientMedications = ({ navigation }) => {
  return (
    <ScreenWithDrawer>
      {/* ✅ "زر داخال نتائج الفحوصات" */}
      <TouchableOpacity
        style={[styles.Button, styles.primaryButton]}
        onPress={() => navigation.navigate("ادخال نتيجة الفحص")}
      >
        <View style={styles.ButtonContent}>
          <Ionicons
            name="list-outline"
            size={24}
            color={colors.buttonPrimaryText}
            style={styles.icon}
          />
          <Text style={styles.ButtonText}>ادخال نتيجة الفحص</Text>
        </View>
      </TouchableOpacity>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
  },
  menuButton: {
    marginRight: spacing.sm,
  },
  headerTitle: {
    color: colors.background,
    fontSize: typography.headingMd,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    marginRight: spacing.xl,
    fontFamily: typography.fontFamily,
  },

  Button: {
    backgroundColor: colors.buttonMuted,
    borderRadius: radii.md,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    margin: spacing.sm,
    ...shadows.light,
  },
  primaryButton: {
    backgroundColor: colors.buttonSuccess,
  },
  ButtonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  ButtonText: {
    color: colors.buttonSuccessText,
    fontSize: typography.headingSm,
    fontWeight: "bold",
    fontFamily: typography.fontFamily,
  },
  icon: {
    marginLeft: spacing.sm,
  },
});

export default PatientMedications;
