import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EducationalContentScreen from '../screensDoctor/EducationalContentScreen';

const Stack = createStackNavigator();

const EducationalContentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="EducationalContentList" 
        component={EducationalContentScreen} 
        options={{ 
          title: 'المحتوى التثقيفي',
          headerStyle: {
            backgroundColor: '#00b29c',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
    </Stack.Navigator>
  );
}

export default EducationalContentStack;
