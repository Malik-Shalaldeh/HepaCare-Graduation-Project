// navigation/LapsNavigator.js
import React from "react";
import { TouchableOpacity, Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import LabsStack from "./LabsStack";
import LabAddScreen from "./LabAddScreen";
import LabDeleteScreen from "./LabDeleteScreen";
import LabsListScreen from "./LabsListScreen";

import { colors, spacing, typography } from "../style/theme";

const Stack = createNativeStackNavigator();
const primary = colors.primary;

const headerBase = (title, navigation) => ({
  headerShown: true,
  title,
  headerTitleAlign: "center",
  headerTintColor: primary,
  headerStyle: { backgroundColor: colors.background },
  headerShadowVisible: false,

  headerTitleStyle: {
    fontFamily: typography.fontFamily,
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  backButtonDisplayMode: "minimal",

  headerBackTitleVisible: false,
  headerBackTitle: "",

  headerLeft: ({ tintColor }) => (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
      }}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons
        name={Platform.OS === "ios" ? "chevron-back" : "arrow-back"}
        size={24}
        color={tintColor || primary}
      />
    </TouchableOpacity>
  ),
});

export default function LabsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LabsHome" component={LabsStack} />

      <Stack.Screen
        name="LabAdd"
        component={LabAddScreen}
        options={({ navigation }) => headerBase("إضافة مختبر", navigation)}
      />
      <Stack.Screen
        name="LabDelete"
        component={LabDeleteScreen}
        options={({ navigation }) => headerBase("حذف مختبر", navigation)}
      />
      <Stack.Screen
        name="LabsList"
        component={LabsListScreen}
        options={({ navigation }) => headerBase("عرض المختبرات", navigation)}
      />
    </Stack.Navigator>
  );
}
