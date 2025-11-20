// navigation/MedicationsStackScreen.js
import { createStackNavigator } from "@react-navigation/stack";
import Medications from "../screensDoctor/Medications";
import MedPatientsScreen from "../screensDoctor/MedPatientsScreen";
import PatientMedicationsScreen from "../screensDoctor/PatientMedicationsScreen";
import MedicationFormScreen from "../screensDoctor/MedicationFormScreen";
import HealthMedicationsDisplay from "../screensDoctor/HealthMedicationsDisplay";
import { colors, typography } from "../style/theme";

const Stack = createStackNavigator();

const MedicationsStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Medications"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",
        headerTintColor: colors.background,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTitleStyle: {
          fontSize: typography.headingSm,
          fontWeight: "700",
          fontFamily: typography.fontFamily,
        },
        headerBackTitleVisible: false,
        headerBackTitle: "",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="Medications"
        component={Medications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MedPatientsScreen"
        component={MedPatientsScreen}
        options={{ title: "أدوية المرضى" }}
      />

      <Stack.Screen
        name="PatientMedications"
        component={PatientMedicationsScreen}
        options={{ title: "أدوية المريض" }}
      />

      {/* أدوية الصحة */}
      <Stack.Screen
        name="HealthMedicationsDisplay"
        component={HealthMedicationsDisplay}
        options={{ title: "أدوية الصحة" }}
      />

      {/* إضافة/تعديل دواء — عنوان ثابت بدون اسم المريض */}
      <Stack.Screen
        name="MedicationForm"
        component={MedicationFormScreen}
        options={({ route }) => ({
          title: route?.params?.mode === "edit" ? "تعديل الدواء" : "جدولة دواء",
        })}
      />
    </Stack.Navigator>
  );
};

export default MedicationsStackScreen;
