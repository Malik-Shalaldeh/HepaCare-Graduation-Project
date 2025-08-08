import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EducationalContentScreen from '../screensCommon/EducationalContentScreen';

const Stack = createStackNavigator();

const EducationalContentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="EducationalContentList" 
        component={EducationalContentScreen} 
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default EducationalContentStack;
