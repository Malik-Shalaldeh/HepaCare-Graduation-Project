// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

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

import HealthWelcomeScreen from "../screensHealth/HealthWelcomeScreen";
import HealthRatingsScreen from "../screensHealth/HealthRatingsScreen";
import EducationalContentScreen from "../screensCommon/EducationalContentScreen";
import CommonLabsScreen from "../screensCommon/LabsScreen";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";
import ChangePasswordScreen from "../Login/restPassword";

const primary = "#2196f3";

// محتوى مخصص للقائمة الجانبية مع زر تسجيل الخروج
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
          style: "destructive",
          onPress: () => navigation.replace("Login"),
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

// تبويبات سفلية بسيطة: لوحة التحكم + التقييمات
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="لوحة التحكم"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            "لوحة التحكم": "home-outline",
            التقييمات: "star-outline",
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
      {/* ترتيب الشاشات هنا يجعل لوحة التحكم على اليمين (RTL) والتقييمات على اليسار */}
      <Tab.Screen name="التقييمات" component={HealthRatingsScreen} />
      <Tab.Screen name="لوحة التحكم" component={HealthWelcomeScreen} />
    </Tab.Navigator>
  );
}

const Drawer = createDrawerNavigator();

export default function HealthDrawerNavigator() {
  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="MainTabs"
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: primary,
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* إخفاء MainTabs من القائمة وإبقاؤه كوجهة رئيسية */}
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
          name="الرئيسية"
          component={MainTabs}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />ئ

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
          name="المحتوى التثقيفي"
          component={EducationalContentScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />

        <Drawer.Screen
          name="المختبرات العامة"
          component={CommonLabsScreen}
          options={{
            headerTitle: "المختبرات المعتمدة",
            drawerIcon: ({ size, color }) => (
              <Ionicons name="flask-outline" size={size} color={color} />
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
