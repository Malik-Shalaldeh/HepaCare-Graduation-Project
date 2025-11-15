import React from "react";
import { StatusBar, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

import Visits from "../screensDoctor/Visits";
import LoginScreen from "../Login/LoginScreen";
import LabsScreen from "../screensDoctor/LabsScreen";
import HistoryVisits from "../screensDoctor/HistoryVisits";
import VisitsSummaryScreen from "../screensDoctor/VisitsSummaryScreen";
import TestsStack from "./TestsStack";
import PatientsStack from "./PatientsStack";
import MedicationsStackScreen from "./medicationStack";
import AppointmentsStack from "./AppointmentsStack";
import EducationalContentStack from "./EducationalContentStack";
import Dashboard from "../screensDoctor/Dashboard";
import EvaluationVisitScreen from "../screensDoctor/EvaluationVisitScreen";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";
import ChangePasswordScreen from "../Login/restPassword";
import PatientsOverviewScreen from "../screensDoctor/PatientsOverviewScreen";

import theme from "../style/theme";

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "تسجيل الخروج",
      "هل أنت متأكد أنك تريد تسجيل الخروج؟",
      [
        { text: "إلغاء", style: "cancel" },
        {
          text: "تسجيل خروج",
          onPress: () => navigation.replace("Login"),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="تسجيل الخروج"
        onPress={handleLogout}
        icon={({ size, color }) => (
          <Ionicons name="log-out-outline" size={size} color={color} />
        )}
      />
    </DrawerContentScrollView>
  );
}

const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="لوحة التحكم"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.buttonPrimaryText,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            الزيارات: "calendar",
            الأدوية: "medkit",
            المرضى: "people",
            "إضافة مريض": "person-add",
            "لوحة التحكم": "home",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          height: 90,
          marginBottom: Platform.OS === "android" ? 5 : 0,
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="الزيارات" component={Visits} />
      <Tab.Screen
        name="الأدوية"
        component={MedicationsStackScreen}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="المرضى"
        component={PatientsStack}
        options={{ headerShown: false }}
      />
      <Tab.Screen name="لوحة التحكم" component={Dashboard} />
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();
function NavigatorDoctor() {
  return (
    <>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="الرئيسية"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.buttonPrimaryText,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontWeight: "bold",
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.headingSm,
          },
          drawerActiveTintColor: theme.colors.primary,
          drawerInactiveTintColor: theme.colors.textSecondary,
          drawerLabelStyle: {
            fontSize: 16,
            fontFamily: theme.typography.fontFamily,
          },
          drawerStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Drawer.Screen
          name="الرئيسية"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="إدارة المواعيد"
          component={AppointmentsStack}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="الفحوصات"
          component={TestsStack}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="analytics-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="المحتوى التثقيفي"
          component={EducationalContentStack}
          options={{
            headerTitle: "المحتوى التثقيفي",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="سياسة التطبيق"
          component={PrivacyPolicyScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons
                name="document-text-outline"
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="اعادة تعيين كلمه المرور"
          component={ChangePasswordScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="تقييم الزيارة"
          component={EvaluationVisitScreen}
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name=" المختبرات المعتمدة"
          component={LabsScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="سجل الزيارات"
          component={HistoryVisits}
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="ملخص الزيارات"
          component={VisitsSummaryScreen}
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="نظرة عامة"
          component={PatientsOverviewScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
            drawerItemStyle: { height: 0 },
          }}
        />
      </Drawer.Navigator>
    </>
  );
}

export default NavigatorDoctor;
