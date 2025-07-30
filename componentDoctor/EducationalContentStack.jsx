// Developed by Sami
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EducationalContentListScreen from '../screensDoctor/EducationalContentListScreen';
import EducationalContentFormScreen from '../screensDoctor/EducationalContentFormScreen';

const Stack = createStackNavigator();

const EducationalContentStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EducationalContentList"
        component={EducationalContentListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EducationalContentForm"
        component={EducationalContentFormScreen}
        options={{ title: 'إضافة محتوى جديد' }}
      />
    </Stack.Navigator>
  );
};

export default EducationalContentStack;
