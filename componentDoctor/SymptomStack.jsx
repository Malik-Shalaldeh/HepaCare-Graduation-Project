// navigations/SymptomStack.jsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import SymptomPatientSearchScreen from "../screensDoctor/SymptomPatientSearchScreen";
import SymptomRecordsScreen from "../screensDoctor/SymptomRecordsScreen";
import SymptomAddScreen from "../screensDoctor/SymptomAddScreen";

const Stack = createStackNavigator();
const primary = "#00b29c";

export default function SymptomStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: primary },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
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
