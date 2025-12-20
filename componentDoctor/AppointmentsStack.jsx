import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppointmentListScreen from '../screensDoctor/AppointmentListScreen';
import AppointmentFormScreen from '../screensDoctor/AppointmentFormScreen';
import theme from "../style/theme";
//sami
const Stack = createStackNavigator();

const AppointmentsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.buttonPrimaryText,
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontWeight: "bold",
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
        },
      }}
    >
      <Stack.Screen
        name="AppointmentList"
        component={AppointmentListScreen}
        options={{ title: "إدارة المواعيد" }}
      />
      <Stack.Screen
        name="AppointmentForm"
        component={AppointmentFormScreen}
        options={{ title: 'موعد جديد' }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentsStack;
