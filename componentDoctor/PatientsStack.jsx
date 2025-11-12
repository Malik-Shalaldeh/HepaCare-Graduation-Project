import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';

import Patients from '../screensDoctor/Patients';
import DataPatientsListScreen from '../screensDoctor/SearchDataPatientSecreen';
import PatientListScreen from '../screensDoctor/PatientListScreen';
import Medications from '../screensDoctor/Medications';
import EvaluationVisitScreen from '../screensDoctor/EvaluationVisitScreen';
import PatientChartScreen from '../screensDoctor/PatientChartScreen';
import AddPatientsScreen from '../screensDoctor/AddPatientsScreen';
import SymptomTrackingScreen from '../screensDoctor/SymptomTrackingScreen';

const Stack = createStackNavigator();
const primary = '#00b29c';

const backBtn = (navigation) => (
  <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingHorizontal: 12 }}>
    <Ionicons name="arrow-back" size={24} color="#fff" />
  </TouchableOpacity>
);

export default function PatientsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        // اختياري: توحيد نوع الحركة
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Patients" component={Patients} options={{ headerShown: false }} />

      {/* البحث عن سجل مريض */}
      <Stack.Screen
        name="PatientListScreen"
        component={PatientListScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'البحث عن سجل مريض',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: primary },
          headerTintColor: '#fff',
          headerLeft: () => backBtn(navigation),
        })}
      />

      {/* عرض بيانات مريض (لو بدك ترانزيشن، خليه داخل الStack) */}
      <Stack.Screen
        name="DataPatientsListScreen"
        component={DataPatientsListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SearchDataPatientSecreen"
        component={DataPatientsListScreen}
        options={{ headerShown: false }}
      />

      {/* إضافة مريض داخل الStack */}
      <Stack.Screen
        name="إضافة مريض"
        component={AddPatientsScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'إضافة مريض',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: primary },
          headerTintColor: '#fff',
          headerLeft: () => backBtn(navigation),
        })}
      />

      {/* تتبع الأعراض داخل الStack */}
      <Stack.Screen
        name="تتبع الأعراض"
        component={SymptomTrackingScreen}
        options={({ navigation }) => ({
          headerShown: true,
          headerTitle: 'تتبع الأعراض',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: primary },
          headerTintColor: '#fff',
          headerLeft: () => backBtn(navigation),
        })}
      />

      <Stack.Screen name="Medications" component={Medications} />
      <Stack.Screen name="EvaluationVisitScreen" component={EvaluationVisitScreen} />
      <Stack.Screen name="PatientChartScreen" component={PatientChartScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
