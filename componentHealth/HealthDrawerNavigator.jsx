// sami
// جميع التعليقات داخل الكود باللغة العربية فقط.

import React from "react";
import { StatusBar, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";

import HealthWelcomeScreen from "../screensHealth/HealthWelcomeScreen";
import HealthRatingsScreen from "../screensHealth/HealthRatingsScreen";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";

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

const Drawer = createDrawerNavigator();

export default function HealthDrawerNavigator() {
  return (
    <>
      <StatusBar backgroundColor={primary} barStyle="light-content" />
      <Drawer.Navigator
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        initialRouteName="الرئيسية"
        screenOptions={{
          headerShown: true,
          drawerActiveTintColor: primary,
          drawerLabelStyle: { fontSize: 16 },
          drawerStyle: { backgroundColor: "#fff" },
        }}
      >
        <Drawer.Screen
          name="الرئيسية"
          component={HealthWelcomeScreen}
          options={{
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home-outline" size={size} color={color} />
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
      </Drawer.Navigator>
    </>
  );
}
