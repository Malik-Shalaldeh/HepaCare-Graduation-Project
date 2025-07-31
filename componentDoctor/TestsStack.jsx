// navigation/TestsStack.js
import { createStackNavigator } from '@react-navigation/stack';
import Tests from '../screensDoctor/Tests';
import TestResultsScreen from '../screensDoctor/TestResultsScreen';
import MedicalIndicatorsScreen from '../screensDoctor/MedicalIndicatorsScreen';
import InputTestResultScreen from '../screensDoctor/InputTestResultScreen';

const Stack = createStackNavigator();

const TestsStack = () => {
  return (
   <Stack.Navigator>
  <Stack.Screen
    name="TestsMain"
    component={Tests}
    options={{ headerShown: false }} // ← هذا يخفي الهيدر تماماً
  />

  <Stack.Screen
    name="InputTestResultScreen"
    component={InputTestResultScreen}
    options={{ title: 'ادخال نتائج الفحوصات' }}
  /> 
  <Stack.Screen
    name="TestResultsScreen"
    component={TestResultsScreen}
    options={{ title: 'نتائج الفحوصات' }}
  /> 

  <Stack.Screen
    name="MedicalIndicatorsScreen"
    component={MedicalIndicatorsScreen}
    options={{ headerShown: false }}
  /> 

  
</Stack.Navigator>

  );
};

export default TestsStack;
