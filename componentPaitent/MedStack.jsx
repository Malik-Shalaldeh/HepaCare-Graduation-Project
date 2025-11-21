// componentPaitent/MedStack.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PatientMedications from "../screenPatient/PatientMedications";
import AvailableMedicationsScreen from "../screenPatient/AvailableMedicationsScreen";
import MyMedicationsScreen from "../screenPatient/MyMedicationsScreen";

import theme from "../style/theme";

const Stack = createStackNavigator();

const MedicationsStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="PatientMedications"
      screenOptions={{
        headerShown: true,
        headerTitleAlign: "center",

        // ✅ ألوان من الثيم
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.buttonPrimaryText,
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
          fontWeight: "700",
        },

        // ✅ يخفي نص الرجوع جنب السهم فقط، مش عنوان الشاشة
        headerBackTitleVisible: false,
        headerBackTitle: "",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen
        name="PatientMedications"
        component={PatientMedications}
        options={{ title: "الأدوية" }}
      />

      <Stack.Screen
        name="AvailableMedications"
        component={AvailableMedicationsScreen}
        options={{ title: "الأدوية المتوفرة بالصحة" }}
      />

      <Stack.Screen
        name="MyMedications"
        component={MyMedicationsScreen}
        options={{ title: "أدويتي" }}
      />
    </Stack.Navigator>
  );
};

export default MedicationsStackScreen;
