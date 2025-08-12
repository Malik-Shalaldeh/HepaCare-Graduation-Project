// ScreensAdmin/AdminTabs.jsx
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// الشاشات
import AdminHome from '../screensAdmin/AdminDashbordScreen';
import DoctorAdminStack from './DoctorAdminStack';
import SettingAdminStack from './SettingAdminStack';
import LapsNavigator from './LapsNavigator'; // ✅ بدل LapsStack


const Tab = createBottomTabNavigator();
const primary = '#00b29c';

 function AdminTabs() {
  return (
    <Tab.Navigator
      initialRouteName="الرئيسية"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 90,
          marginBottom: Platform.OS === 'android' ? 5 : 0,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="الاعدادات"
        component={SettingAdminStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="الأطباء"
        component={DoctorAdminStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="medkit" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="الرئيسية"
        component={AdminHome}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="المختبرات"
        component={LapsNavigator} 
        options={{ tabBarIcon: ({ color, size }) => <Ionicons name="flask" size={size} color={color} /> }}
      />
    </Tab.Navigator>
  );
}

export default AdminTabs;