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

// استدعاء قيم التصميم الموحد
import { colors, spacing, typography } from "../style/theme";

// اللون الأساسي من ملف الـ theme
const primary = colors.primary;

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
        headerTitleAlign: "center",
        headerTintColor: colors.textOnPrimary || "#fff",
        headerStyle: {
          backgroundColor: primary,
        },
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
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 80,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: Platform.OS === "ios" ? spacing.sm : 4,
        },
        tabBarLabelStyle: {
          fontSize: typography.bodySm,
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
      {/* شريط الحالة بلون التطبيق الموحد */}
      <StatusBar backgroundColor={primary} barStyle="light-content" />

      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="الرئيسية"   // ✅ صارت البداية على شاشة "الرئيسية"
        screenOptions={{
          headerShown: true,
          headerTitleAlign: "center",
          headerTintColor: colors.textOnPrimary || "#fff",
          headerStyle: {
            backgroundColor: primary,
          },
          drawerActiveTintColor: primary,
          drawerInactiveTintColor: colors.textSecondary,
          drawerLabelStyle: {
            fontSize: typography.bodyMd,
          },
          drawerStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        {/* ✅ شاشة واحدة فقط تستخدم MainTabs، وبدون هيدر من الـ Drawer */}
        <Drawer.Screen
          name="الرئيسية"
          component={MainTabs}
          options={{
            headerShown: false, // مهم: عشان ما يطلع هيدر ثاني فوق التابات
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
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
