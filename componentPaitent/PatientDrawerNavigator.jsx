// navigation/NavigatorPatient.js
import { StatusBar } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import MainTabs from "./MainTabs";
import CustomDrawerContent from "./CustomDrawerContent";
import EducationalContentScreen from "../screensCommon/EducationalContentScreen";
import FeedbackScreen from "../screenPatient/FeedbackScreen";
import ChangePasswordScreen from "../Login/restPassword";
import PrivacyPolicyScreen from "../screensCommon/PolicyScreen";
import PatientAppointmentsScreen from "../screenPatient/PatientAppointmentsScreen";
import LabsScreen from "../screenPatient/LabsScreen";
import theme from "../style/theme";

const Drawer = createDrawerNavigator();
const primary = theme.colors.primary;

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
            drawerLabel: "الرئيسية",
            headerShown: false,
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
