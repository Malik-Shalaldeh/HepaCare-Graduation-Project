import { View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import theme from "../style/theme";

export default function AdminHome() {
  const today = new Date();
  const months = [
    "يناير","فبراير","مارس","أبريل","مايو","يونيو",
    "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر",
  ];
  const date = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

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

      {/* محتوى الصفحة */}
      <View style={styles.page}>
        <View style={styles.logoCard}>
          <Text style={styles.logoText}>HepaCare</Text>
          <Text style={{ ...styles.logoDate, color: "#ffffff" }}>{date}</Text>
        </View>

        <View style={styles.welcomeCard}>
          <View style={styles.textBox}>
            <Text style={styles.welcomeTitle}>مرحباً أيها المدير 👋</Text>
            <Text style={styles.adminSubtitle}>
              لوحة القيادة بين يديك، كل شيء تحت سيطرتك!
            </Text>
          </View>
          <Ionicons
            name="person-circle-outline"
            size={44}
            color={theme.colors.primary}
            style={styles.iconLeft}
          />
        </View>

        <View style={styles.adminCard}>
          <View style={styles.textBox}>
            <Text style={styles.adminTitle}>صلاحيات كاملة</Text>
            <Text style={styles.adminSubtitle}>
              يمكنك إدارة النظام بالكامل والتحكم بالسجلات
            </Text>
          </View>
          <Ionicons
            name="shield-checkmark-outline"
            size={44}
            color={theme.colors.primary}
            style={styles.iconLeft}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    marginTop:50
  },
  logoCard: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.lg,
    alignItems: "center",
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  logoText: {
    fontSize: theme.typography.headingMd,
    fontWeight: "800",
    color: theme.colors.buttonPrimaryText,
    letterSpacing: 1.5,
    fontFamily: theme.typography.fontFamily,
  },
  logoDate: {
    fontSize: theme.typography.bodySm,
    marginTop: theme.spacing.xs,
    fontFamily: theme.typography.fontFamily,
  },
  textBox: {
    flex: 1,
    alignItems: "flex-end",
  },
  welcomeCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginTop: 50,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: theme.typography.headingSm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  adminCard: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  adminTitle: {
    fontSize: theme.typography.headingSm,
    fontWeight: "700",
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  adminSubtitle: {
    fontSize: theme.typography.bodySm,
    color: theme.colors.textSecondary,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },
  iconLeft: {
    marginLeft: theme.spacing.sm,
  },
});
