// navigations/SymptomStack.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SymptomPatientSearchScreen from "../screensDoctor/SymptomPatientSearchScreen";
import SymptomRecordsScreen from "../screensDoctor/SymptomRecordsScreen";
import SymptomAddScreen from "../screensDoctor/SymptomAddScreen";
import { colors, typography } from "../style/theme";

const Stack = createStackNavigator();

export default function SymptomStack() {
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
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="SymptomPatientSearch"
        component={SymptomPatientSearchScreen}
        options={{ title: "اختيار مريض" }}
      />
      <Stack.Screen
        name="SymptomRecords"
        component={SymptomRecordsScreen}
        options={{ title: "سجل أعراض المريض" }}
      />
      <Stack.Screen
        name="SymptomAdd"
        component={SymptomAddScreen}
        options={{ title: "تسجيل عرض جديد" }}
      />
    </Stack.Navigator>
  );
}
