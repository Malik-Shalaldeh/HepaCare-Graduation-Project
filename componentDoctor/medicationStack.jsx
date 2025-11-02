// navigation/MedicationsStackScreen.js
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import Medications from "../screensDoctor/Medications";

// الشاشات الجديدة اللي قسمناها
import MedPatientsScreen from "../screensDoctor/MedPatientsScreen";
import PatientMedicationsScreen from "../screensDoctor/PatientMedicationsScreen";
import MedicationFormScreen from "../screensDoctor/MedicationFormScreen";

const Stack = createStackNavigator();

const MedicationsStackScreen = () => {
  return (
    <Stack.Navigator
      initialRouteName="Medications"
      screenOptions={{ headerShown: false }}
    >
      {/* شاشة البداية تبعتك */}
      <Stack.Screen name="Medications" component={Medications} />

      {/* 1) شاشة المرضى – الاسم الجديد */}
      <Stack.Screen name="MedPatients" component={MedPatientsScreen} />
      {/* نفس الشاشة لكن بالاسم القديم اللي كان في Medications.jsx */}
      <Stack.Screen name="MedPatientsScreen" component={MedPatientsScreen} />

      {/* 2) شاشة أدوية المريض – الاسم الجديد */}
      <Stack.Screen
        name="PatientMedications"
        component={PatientMedicationsScreen}
      />
      {/* اسمك القديم HealthMedicationsDisplay بيروح لنفس الشاشة عشان ما يكسر شيء */}
      <Stack.Screen
        name="HealthMedicationsDisplay"
        component={PatientMedicationsScreen}
      />

      {/* 3) شاشة إضافة/تعديل دواء */}
      <Stack.Screen name="MedicationForm" component={MedicationFormScreen} />
    </Stack.Navigator>
  );
};

export default MedicationsStackScreen;
