// Patients.jsx
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

  return (
    <View
      style={styles.container}
    >
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* الهيدر */}
      <View
        style={styles.header}
      >
        {/* زر القائمة الجانبية */}
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          activeOpacity={0.8}
        >
          <Ionicons
            name="menu"
            size={28}
            color={theme.colors.buttonPrimaryText}
          />
        </TouchableOpacity>

        <Text
          style={styles.headerTitle}
        >
          المرضى
        </Text>

        <View style={{ width: 28 }} />
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
      
        <TouchableOpacity
          style={[styles.button, styles.addButton]}
          onPress={() => navigation.navigate("إضافة مريض")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="person-add-outline"
              size={22}
              color={theme.colors.buttonPrimaryText}
            />
            <Text
              style={[styles.buttonText, styles.buttonTextPrimary]}
            >
              إضافة مريض
            </Text>
          </View>
        </TouchableOpacity>

        {/* زر البحث عن سجل مريض */}
        <TouchableOpacity
          style={[styles.button, styles.searchButton]}
          onPress={() => navigation.navigate("PatientListScreen")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="search-outline"
              size={22}
              color={theme.colors.buttonInfoText}
            />
            <Text
              style={[styles.buttonText, styles.buttonTextInfo]}
            >
              البحث عن سجل مريض
            </Text>
          </View>
        </TouchableOpacity>

        {/* زر تتبع الأعراض -*/}
        <TouchableOpacity
          style={[styles.button, styles.symptomsButton]}
          onPress={() => navigation.navigate("تتبع الأعراض")}
          activeOpacity={0.8}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="pulse-outline"
              size={22}
              color={theme.colors.buttonSecondaryText}
            />
            <Text
              style={[styles.buttonText, styles.buttonTextSecondary]}
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
    paddingTop:
      Platform.OS === "android"
      ? StatusBar.currentHeight || 0
      : 44,
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
