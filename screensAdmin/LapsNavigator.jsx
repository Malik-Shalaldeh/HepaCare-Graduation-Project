// navigation/LapsNavigator.js
import React from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';


import LabsStack from './LabsStack'; // اللي عملناه سابقاً
import LabAddScreen from './LabAddScreen';
import LabDeleteScreen from './LabDeleteScreen';
import LabsListScreen from './LabsListScreen';

const Stack = createNativeStackNavigator();
const primary = '#00b29c';

const headerBase = (title, navigation) => ({
  headerShown: true,
  title,
  headerTitleAlign: 'center',
  headerTintColor: primary,
  headerStyle: { backgroundColor: '#fff' },
  headerShadowVisible: false,

  // iOS (native-stack): إخفاء نص اسم الشاشة السابقة
  backButtonDisplayMode: 'minimal',

  // احتياط للـ stack العادي
  headerBackTitleVisible: false,
  headerBackTitle: '',

  // فallback مضمون: آيكون فقط بدون نص
  headerLeft: ({ tintColor }) => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{ paddingHorizontal: 8, paddingVertical: 4 }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
        size={24}
        color={tintColor || primary}
      />
    </TouchableOpacity>
  ),
});

export default function LabsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* الرئيسية بدون هيدر */}
      <Stack.Screen name="LabsHome" component={LabsStack} />

      {/* الشاشات الفرعية مع هيدر بدون Back title */}
      <Stack.Screen
        name="LabAdd"
        component={LabAddScreen}
        options={({ navigation }) => headerBase('إضافة مختبر', navigation)}
      />
      <Stack.Screen
        name="LabDelete"
        component={LabDeleteScreen}
        options={({ navigation }) => headerBase('حذف مختبر', navigation)}
      />
      <Stack.Screen
        name="LabsList"
        component={LabsListScreen}
        options={({ navigation }) => headerBase('عرض المختبرات', navigation)}
      />
    </Stack.Navigator>
  );
}