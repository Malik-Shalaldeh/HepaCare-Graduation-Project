// navigation/LapsNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LabsStack from './LabsStack'; // اللي عملناه سابقاً
import LabAddScreen from './LabAddScreen';
import LabDeleteScreen from './LabDeleteScreen';
import LabsListScreen from './LabsListScreen';

const Stack = createNativeStackNavigator();
const primary = '#376e5eff';

const headerOptions = {
  headerShown: true,
  headerTitleAlign: 'center',
  headerTintColor: primary,
  headerStyle: { backgroundColor: '#fff' },
  headerShadowVisible: false,   // iOS: بدون خط تحت الهيدر
  animation: 'slide_from_right',
};

export default function LapsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* الهوم بدون هيدر */}
      <Stack.Screen name="LabsHome" component={LabsStack} />

      {/* الشاشات التالية مع هيدر */}
      <Stack.Screen
        name="LabAdd"
        component={LabAddScreen}
        options={{ ...headerOptions, title: 'إضافة مختبر' }}
      />
      <Stack.Screen
        name="LabDelete"
        component={LabDeleteScreen}
        options={{ ...headerOptions, title: 'حذف مختبر' }}
      />
      <Stack.Screen
        name="LabsList"
        component={LabsListScreen}
        options={{ ...headerOptions, title: 'عرض المختبرات' }}
      />
    </Stack.Navigator>
  );
}