// Patients.jsx
import { useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import theme from "../style/theme";

const Patients = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <View
      style={styles.container}
      accessibilityLanguage="ar"
    >
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* الهيدر */}
      <View
        style={styles.header}
        accessible
        accessibilityRole="header"
        accessibilityLabel="شاشة إدارة المرضى"
        accessibilityHint="تعرض خيارات لإضافة مريض جديد أو البحث عن مريض أو تتبع الأعراض"
        accessibilityLanguage="ar"
      >
        {/* زر القائمة الجانبية */}
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="فتح قائمة التنقل الجانبية"
          accessibilityHint="يفتح القائمة الجانبية للتنقل بين شاشات الطبيب"
          accessibilityLanguage="ar"
        >
          <Ionicons
            name="menu"
            size={28}
            color={theme.colors.buttonPrimaryText}
            accessibilityRole="image"
            accessibilityLabel="أيقونة قائمة"
            accessibilityLanguage="ar"
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
          accessibilityRole="text"
          accessibilityLabel="المرضى"
          accessibilityLanguage="ar"
        >
          المرضى
        </Text>

        {/* عنصر فارغ للموازنة البصرية */}
        <View style={{ width: 28 }} />
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
        {/* زر إضافة مريض - أساسي */}
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => navigation.navigate("إضافة مريض")}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="إضافة مريض جديد"
          accessibilityHint="ينقلك إلى شاشة إدخال بيانات مريض جديد"
          accessibilityLanguage="ar"
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="person-add-outline"
              size={22}
              color={theme.colors.buttonPrimaryText}
              accessibilityRole="image"
              accessibilityLabel="أيقونة إضافة مريض"
              accessibilityLanguage="ar"
            />
            <Text
              style={[styles.buttonText, styles.buttonTextPrimary]}
              accessibilityRole="text"
              accessibilityLanguage="ar"
            >
              إضافة مريض
            </Text>
          </View>
        </TouchableOpacity>

        {/* زر البحث عن سجل مريض - Info */}
        <TouchableOpacity
          style={[styles.button, styles.searchButton]}
          onPress={() => navigation.navigate("PatientListScreen")}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="البحث عن سجل مريض"
          accessibilityHint="ينقلك إلى شاشة البحث عن مرضى وعرض سجلاتهم"
          accessibilityLanguage="ar"
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="search-outline"
              size={22}
              color={theme.colors.buttonInfoText}
              accessibilityRole="image"
              accessibilityLabel="أيقونة بحث"
              accessibilityLanguage="ar"
            />
            <Text
              style={[styles.buttonText, styles.buttonTextInfo]}
              accessibilityRole="text"
              accessibilityLanguage="ar"
            >
              البحث عن سجل مريض
            </Text>
          </View>
        </TouchableOpacity>

        {/* زر تتبع الأعراض - Secondary */}
        <TouchableOpacity
          style={[styles.button, styles.symptomsButton]}
          onPress={() => navigation.navigate("تتبع الأعراض")}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="تتبع الأعراض"
          accessibilityHint="ينقلك إلى شاشة تسجيل وتتبع أعراض المرضى"
          accessibilityLanguage="ar"
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="pulse-outline"
              size={22}
              color={theme.colors.buttonSecondaryText}
              accessibilityRole="image"
              accessibilityLabel="أيقونة نبض"
              accessibilityLanguage="ar"
            />
            <Text
              style={[styles.buttonText, styles.buttonTextSecondary]}
              accessibilityRole="text"
              accessibilityLanguage="ar"
            >
              تتبع الأعراض
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) : 0,
    paddingBottom: theme.spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  headerTitle: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.headingMd,
    fontWeight: "bold",
    fontFamily: theme.typography.fontFamily,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  button: {
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  addButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  searchButton: {
    backgroundColor: theme.colors.buttonInfo,
  },
  symptomsButton: {
    backgroundColor: theme.colors.buttonSecondary,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: theme.typography.bodyLg,
    fontWeight: "bold",
    marginRight: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  buttonTextPrimary: {
    color: theme.colors.buttonPrimaryText,
  },
  buttonTextInfo: {
    color: theme.colors.buttonInfoText,
  },
  buttonTextSecondary: {
    color: theme.colors.buttonSecondaryText,
  },
});

export default Patients;
