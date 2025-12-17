// navigations/AddPatientStack.jsx
import { createStackNavigator } from "@react-navigation/stack";
import AddPatientStep1Screen from "../screensDoctor/AddPatientStep1Screen";
import AddPatientStep2Screen from "../screensDoctor/AddPatientStep2Screen";
import AddPatientStep3Screen from "../screensDoctor/AddPatientStep3Screen";
import { colors, typography } from "../style/theme";
import PatientsStack from "./PatientsStack";

const Stack = createStackNavigator();

export default function AddPatientStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.background,
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        headerTitleStyle: {
          fontFamily: typography.fontFamily,
          fontSize: typography.headingSm,
        },
      }}
    >
      <Stack.Screen
        name="AddPatientStep1"
        component={AddPatientStep1Screen}
        options={{ title: "بيانات المريض" }}
      />

          <Stack.Screen
        name="المرضى"
        component={PatientsStack}
        options={{ headerShown:false}}
      />
      
      
      <Stack.Screen
        name="AddPatientStep2"
        component={AddPatientStep2Screen}
        options={{ title: "أمراض المريض" }}
      />
      <Stack.Screen
        name="AddPatientStep3"
        component={AddPatientStep3Screen}
        options={{ title: "أدوية المريض" }}
      />
    </Stack.Navigator>
  );
}
