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

// شاشات المريض
import TestResultsScreen from "../screenPatient/TestResultsScreen";
import LabsScreen from "../screenPatient/LabsScreen";
import PatientAppointmentsScreen from "../screenPatient/PatientAppointmentsScreen";
import PatientDashboard from "../screenPatient/PatientDashboard";
import EducationalContentScreen from "../screensCommon/EducationalContentScreen";
import FeedbackScreen from "../screenPatient/FeedbackScreen";
import ChangePasswordScreen from "../Login/restPassword";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";

// ✅ ستاك الأدوية
import MedicationsStack from "./MedStack";

import theme from "../style/theme";
const primary = theme.colors.primary;

// محتوى الدرور
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

// التابات
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="لوحة التحكم"
      screenOptions={({ route }) => ({
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.buttonPrimaryText,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          const icons = {
            الفحوصات: "flask-outline",
            الأدوية: "medkit",
            "لوحة التحكم": "home-outline",
          };
          return (
            <Ionicons name={icons[route.name]} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          height: 90,
          marginBottom: Platform.OS === "android" ? 5 : 0,
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen name="الفحوصات" component={TestResultsScreen} />

      {/* ✅ التاب يفتح شاشة PatientMedications داخل الستاك */}
      <Tab.Screen
        name="الأدوية"
        component={MedicationsStack}
        options={{
          headerShown: false, // ✅ يمنع هيدر التاب (حتى ما يصير نفيقيتور فوق نفيقيتور)
        }}
      />

      <Tab.Screen name="لوحة التحكم" component={PatientDashboard} />
    </Tab.Navigator>
  );
}

// الدرور
const Drawer = createDrawerNavigator();
export default function NavigatorPatient() {
  return (
    <>
      <StatusBar
        backgroundColor={primary}
        barStyle="light-content"
        translucent={false}
      />

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: true,
          headerStyle: { backgroundColor: theme.colors.primary },
          headerTintColor: theme.colors.buttonPrimaryText,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.headingSm,
            fontWeight: "700",
          },
          drawerActiveTintColor: primary,
          drawerLabelStyle: {
            fontSize: 16,
            fontFamily: theme.typography.fontFamily,
          },
          drawerStyle: { backgroundColor: "#fff" },
        }}
      >
        <Drawer.Screen
          name="MainTabs"
          component={MainTabs}
          options={{
            drawerLabel: () => null,
            title: null,
            headerShown: false,
            drawerIcon: () => null,
          }}
        />

        <Drawer.Screen
          name="المحتوى التثقيفي"
          component={EducationalContentScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="تقييم جودة الخدمات"
          component={FeedbackScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="thumbs-up-outline" size={size} color={color} />
            ),
          }}
        />

        {/* ❌ شاشات الأدوية مش موجودة بالدرور */}

        <Drawer.Screen
          name="مواعيدي"
          component={PatientAppointmentsScreen}
          options={{
            headerTitle: "مواعيدي القادمة",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="المختبرات المعتمدة"
          component={LabsScreen}
          options={{
            headerTitle: "المختبرات المعتمدة من وزارة الصحة",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="سياسة التطبيق"
          component={PrivacyPolicyScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="document-text-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="إعادة تعيين كلمة المرور"
          component={ChangePasswordScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="key-outline" size={size} color={color} />
            ),
          }}
        />
      </Drawer.Navigator>
    </>
  );
}
