// screensAdmin/AdminStack.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// الشاشات
import ChangePasswordScreen from '../Login/restPassword';   
import PrivacyPolicyScreen from '../screensCommon/PolicyScreen';   
import Setting from './Setting';
import UpdateUserPasswordScreen from './UpdateUserPasswordScreen';


const Stack = createNativeStackNavigator();

export default function SettingAdminStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ title: 'اعادة تعيين كلمة المرور' }}
      />
      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{ title: 'الاطلاع على السياسة' }}
      />
      <Stack.Screen
        name="UpdateUserPasswordScreen"
        component={UpdateUserPasswordScreen}
        options={{ title: 'تحديث كلمة مرور مستخدم' }}
      />
    </Stack.Navigator>
  );
}
