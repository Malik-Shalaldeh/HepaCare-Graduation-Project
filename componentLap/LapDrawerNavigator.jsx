import React from "react";
import { StatusBar, Alert, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

// شاشاتك
import LapDashboard from "../screensLabs/LapDashboard";
import EducationalContentScreen from "../screensCommon/EducationalContentScreen";
import HealthRatingsScreen from "../screensHealth/HealthRatingsScreen";
import ChangePasswordScreen from "../Login/restPassword";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";
import TestScreen from "../screensLabs/TestScreen";

const primary = "#2196f3"; // اللون الرئيسي

// ✅ محتوى الـ Drawer مع زر تسجيل الخروج
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

// ✅ مكون التابات السفلية (MainTabs)
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="لوحة التحكم"
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            الفحوصات: "flask-outline",
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
        tabBarHideOnKeyboard: true, // بنخفي البار السفلي أول ما يطلع الكيبورد
      })}
    >
      <Tab.Screen name="الفحوصات" component={TestScreen} />

      <Tab.Screen name="لوحة التحكم" component={LapDashboard} />
    </Tab.Navigator>
  );
}

// ✅ Drawer Navigator
const Drawer = createDrawerNavigator();
function NavigatorPatient() {
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
          drawerActiveTintColor: primary,
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* هذا العنصر هو لإخفاء MainTabs من الـ Drawer */}
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

        {/* شاشات القائمة الجانبية */}
        <Drawer.Screen
          name="الرئيسية"
          component={MainTabs}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
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
          name="التقييمات"
          component={HealthRatingsScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="star-outline" size={size} color={color} />
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

export default NavigatorPatient;
