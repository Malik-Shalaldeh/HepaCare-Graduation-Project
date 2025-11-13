// navigations/AddPatientStack.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AddPatientStep1Screen from "../screensDoctor/AddPatientStep1Screen";
import AddPatientStep2Screen from "../screensDoctor/AddPatientStep2Screen";
import AddPatientStep3Screen from "../screensDoctor/AddPatientStep3Screen";

const Stack = createStackNavigator();
const primary = "#00b29c";

export default function AddPatientStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: primary },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerBackTitleVisible: false, // ✅ يخفي كلمة Back واسم الشاشة السابقة
      }}
    >
      <Stack.Screen
        name="AddPatientStep1"
        component={AddPatientStep1Screen}
        options={{ title: "بيانات المريض" }}
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
