// screensAdmin/DoctorAdminStack.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import theme from '../style/theme';
import DoctorsScreen from './DoctorsOperationsScreen';
import DeleteDoctorScreen from './DeleteDoctors';
import AddNewDoctorScreen from './AddNewDoctorScreen';
import AllDoctorsScreen from './ListAllDoctorsScreen';

const Stack = createNativeStackNavigator();

export default function DoctorAdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',                 // لون النص + السهم
        headerTitleAlign: 'center',         
        headerTitleStyle: {
          fontSize: theme.typography.headingSm,
          fontWeight: '700',
          fontFamily: theme.typography.fontFamily,
        },
        headerBackTitleVisible: false,           // يخفي نص العودة في iOS
      }}
    >
      <Stack.Screen
        name="DoctorsHome"
        component={DoctorsScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="DeleteDoctor"
        component={DeleteDoctorScreen}
        options={{ title: 'تعطيل / تفعيل حساب طبيب' }}
      />

      <Stack.Screen
        name="AddDoctor"
        component={AddNewDoctorScreen}
        options={{ title: 'إضافة طبيب' }}
      />

      <Stack.Screen
        name="AllDoctors"
        component={AllDoctorsScreen}
        options={{ title: 'عرض جميع الأطباء' }}
      />
    </Stack.Navigator>
  );
}
