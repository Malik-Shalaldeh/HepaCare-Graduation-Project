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
import PatientMedications from "../screenPatient/PatientMedications";
import PatientDashboard from "../screenPatient/PatientDashboard";
import EducationalContentScreen from "../screensCommon/EducationalContentScreen";
import FeedbackScreen from "../screenPatient/FeedbackScreen";
import ChangePasswordScreen from "../Login/restPassword";
import AvailableMedicationsScreen from "../screenPatient/AvailableMedicationsScreen";
import MyMedicationsScreen from "../screenPatient/MyMedicationsScreen";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";

// 🎨 الثيم الموحد
import theme from "../style/theme";

const primary = theme.colors.primary;

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

// ✅ التابات السفلية (MainTabs)
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
      <Tab.Screen name="الأدوية" component={PatientMedications} />
      <Tab.Screen name="لوحة التحكم" component={PatientDashboard} />
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
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.buttonPrimaryText,
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontFamily: theme.typography.fontFamily,
            fontSize: theme.typography.headingSm,
            fontWeight: "700",
          },
          drawerActiveTintColor: primary,
          drawerLabelStyle: { fontSize: 16, fontFamily: theme.typography.fontFamily },
          drawerStyle: { backgroundColor: "#fff" },
        }}
      >
        {/* إخفاء MainTabs من الـ Drawer */}
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

        <Drawer.Screen
          name="الأدوية التي أتناولها"
          component={MyMedicationsScreen}
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="الأدوية المتوفرة في الصحة"
          component={AvailableMedicationsScreen}
          options={{
            drawerItemStyle: { height: 0 },
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name="مواعيدي"
          component={PatientAppointmentsScreen}
          options={{
            headerTitle: "مواعيدي القادمة",
            headerTitleAlign: "center",
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
            headerTitleAlign: "center",
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
              <Ionicons
                name="document-text-outline"
                size={size}
                color={color}
              />
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
