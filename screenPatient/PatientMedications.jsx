// screensPatient/PatientMedications.jsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import theme from "../style/theme";

const PatientMedications = () => {
  const navigation = useNavigation();

  return (
    <ScreenWithDrawer title="الأدوية">
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.button, styles.currentMedsButton]}
          onPress={() => navigation.navigate("MyMedications")}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="medkit-outline"
              size={24}
              color={theme.colors.buttonPrimaryText}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>الأدوية التي أتناولها</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.mohMedsButton]}
          onPress={() => navigation.navigate("AvailableMedications")}
          activeOpacity={0.9}
        >
          <View style={styles.buttonContent}>
            <Ionicons
              name="list-outline"
              size={24}
              color={theme.colors.buttonPrimaryText}
              style={styles.icon}
            />
            <Text style={styles.buttonText}>الأدوية المتوفرة في الصحة</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  button: {
    backgroundColor: theme.colors.buttonMuted,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginHorizontal: theme.spacing.xs,
    ...theme.shadows.light,
  },
  currentMedsButton: { backgroundColor: theme.colors.buttonPrimary },
  mohMedsButton: { backgroundColor: theme.colors.buttonInfo },
  buttonContent: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.headingSm,
    fontWeight: "bold",
    textAlign: "right",
    flex: 1,
    fontFamily: theme.typography.fontFamily,
  },
  icon: { marginLeft: theme.spacing.sm },
});

export default PatientMedications;
