import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AppointmentListScreen from '../screensDoctor/AppointmentListScreen';
import AppointmentFormScreen from '../screensDoctor/AppointmentFormScreen';
//sami
const Stack = createStackNavigator();

const AppointmentsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AppointmentList"
        component={AppointmentListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AppointmentForm"
        component={AppointmentFormScreen}
        options={{ title: 'موعد' }}
      />
    </Stack.Navigator>
  );
};

export default AppointmentsStack;
