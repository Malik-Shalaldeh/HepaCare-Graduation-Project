// navigation/TestsStack.js
import { createStackNavigator } from '@react-navigation/stack';
import Tests from '../screensDoctor/Tests';
import TestResultsScreen from '../screensDoctor/TestResultsScreen';
import MedicalIndicatorsScreen from '../screensDoctor/MedicalIndicatorsScreen';
import InputTestResultScreen from '../screensDoctor/InputTestResultScreen';
import theme from '../style/theme';
import FileViewerScreen from '../screensDoctor/FileViewerScreen';

const Stack = createStackNavigator();

const TestsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,        
        },
        headerTintColor: theme.colors.buttonPrimaryText,  // لون النص والأيقونة (زر الرجوع)
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
        },
        headerBackTitleVisible: false, // يخفي كلمة "Back" في iOS
      }}
    >
      <Stack.Screen
        name="TestsMain"
        component={Tests}
        options={{ headerShown: false }} // شاشة القائمة الرئيسية للفحوصات بدون هيدر ستاك
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
        name="FileViewer"
        component={FileViewerScreen}
        options={{ title: 'عرض الملف' }}
      />


      <Stack.Screen
        name="MedicalIndicatorsScreen"
        component={MedicalIndicatorsScreen}
        options={{ title: 'حساب القيم الطبية' }}
      />
    </Stack.Navigator>
  );
};

export default TestsStack;
