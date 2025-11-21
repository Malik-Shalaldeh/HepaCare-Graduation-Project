// App.js
import { I18nManager } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from "./Login/LoginScreen";
import NavigatorPatient from "./componentPaitent/PatientDrawerNavigator";
import NavigatorDoctor from "./componentDoctor/navigatorDoctorScreen";
import { AppointmentsProvider } from "./contexts/AppointmentsContext";
import NavigatorLab from "./componentLap/LapDrawerNavigator";
import AdminTabs from "./screensAdmin/AdminTabs";
import HealthDrawerNavigator from "./componentHealth/HealthDrawerNavigator";

// 🟢 أوقف RTL ومنعه تماماً داخل التطبيق
I18nManager.forceRTL(false);
I18nManager.allowRTL(false);

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <AppointmentsProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{ headerShown: false }}
          >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Doctor" component={NavigatorDoctor} />
            <Stack.Screen name="Patient" component={NavigatorPatient} />
            <Stack.Screen name="Admin" component={AdminTabs} />
            <Stack.Screen name="Labs" component={NavigatorLab} />
            <Stack.Screen name="Health" component={HealthDrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </AppointmentsProvider>
    </SafeAreaProvider>
  );
}
