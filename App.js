// App.js
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Login/LoginScreen';
import NavigatorPatient from './componentPaitent/PatientDrawerNavigator';
import NavigatorDoctor from './componentDoctor/navigatorDoctorScreen';
import HealthWelcomeScreen from './screensHealth/HealthWelcomeScreen';
import { VisitDataProvider } from './contexts/VisitDataContext';
import { AppointmentsProvider } from './contexts/AppointmentsContext';
import { EducationalContentProvider } from './contexts/EducationalContentContext';
import NavigatorLab from './componentLap/LapDrawerNavigator';
import AdminTabs from './screensAdmin/AdminTabs';



const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <VisitDataProvider>
      <AppointmentsProvider>
        <EducationalContentProvider>
          <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Doctor" component={NavigatorDoctor} />
          <Stack.Screen name="Patient" component={NavigatorPatient} />
          <Stack.Screen name="Admin" component={AdminTabs} />
          <Stack.Screen name="Labs" component={NavigatorLab} />
          <Stack.Screen name="Health" component={HealthWelcomeScreen} />
        </Stack.Navigator>
          </NavigationContainer>
        </EducationalContentProvider>
      </AppointmentsProvider>
    </VisitDataProvider>
  );
}
