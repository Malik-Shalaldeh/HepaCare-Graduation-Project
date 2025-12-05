// navigation/MainTabs.js
import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import TestResultsScreen from "../screenPatient/TestResultsScreen";
import MedicationsStack from "./MedStack";
import PatientDashboard from "../screenPatient/PatientDashboard";
import theme from "../style/theme";

const Tab = createBottomTabNavigator();
const primary = theme.colors.primary;

export default function MainTabs() {
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

      <Tab.Screen
        name="الأدوية"
        component={MedicationsStack}
        options={{ headerShown: false }}
      />

      <Tab.Screen name="لوحة التحكم" component={PatientDashboard} />
    </Tab.Navigator>
  );
}
