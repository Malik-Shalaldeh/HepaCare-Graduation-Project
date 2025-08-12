// screensAdmin/DoctorAdminStack.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// الشاشات
import DoctorsScreen from './DoctorsOperationsScreen';   
import DeleteDoctorScreen from './DeleteDoctors'; 
import AddNewDoctorScreen from './AddNewDoctorScreen';
import AllDoctorsScreen from './ListAllDoctorsScreen';

const Stack = createNativeStackNavigator();

export default function DoctorAdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DoctorsHome"
        component={DoctorsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeleteDoctor"
        component={DeleteDoctorScreen}
        options={{ title: 'حذف طبيب' }}
      />
      <Stack.Screen
        name="AddDoctor"
        component={AddNewDoctorScreen}
        options={{ title: 'اضافة طبيب' }}
      />

       <Stack.Screen
        name="AllDoctors"
        component={AllDoctorsScreen}
        options={{ title: 'عرض جميع الاطباء' }}
      />
      

      
    </Stack.Navigator>
  );
}
