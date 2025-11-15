// screensAdmin/AdminStack.jsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// الشاشات
import ChangePasswordScreen from '../Login/restPassword';
import PrivacyPolicyScreen from '../screensCommon/PolicyScreen';
import Setting from './Setting';
import UpdateUserPasswordScreen from './UpdateUserPasswordScreen';

import theme from '../style/theme';

const Stack = createNativeStackNavigator();

export default function SettingAdminStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.buttonPrimaryText,
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontFamily: theme.typography.fontFamily,
          fontSize: theme.typography.headingSm,
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ title: 'إعادة تعيين كلمة المرور' }}
      />

      <Stack.Screen
        name="PrivacyPolicyScreen"
        component={PrivacyPolicyScreen}
        options={{ title: 'الاطلاع على سياسة الخصوصية' }}
      />

      <Stack.Screen
        name="UpdateUserPasswordScreen"
        component={UpdateUserPasswordScreen}
        options={{ title: 'تحديث كلمة مرور مستخدم' }}
      />
    </Stack.Navigator>
  );
}
