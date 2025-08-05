import { Alert, Platform } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


import EducationalContentScreen from '../screensDoctor/EducationalContentScreen';
import FeedbackScreen from '../screenPatient/FeedbackScreen';
import TestResultsScreen from '../screenPatient/TestResultsScreen';
import PatientMedications from '../screenPatient/PatientMedications';
import PatientDashboard from '../screenPatient/PatientDashboard';
import ChatScreen from '../screensDoctor/ChatScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChangePasswordScreen from '../Login/restPassword';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Tab.Navigator
        initialRouteName="DashboardTab"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            if (route.name === 'DashboardTab') 
            {
              return <Ionicons name="home-outline" size={size} color={color} />;
            }
            else if (route.name === 'MessagesTab') 
            {
              return <Ionicons name="chatbubbles-outline" size={size} color={color} />;
            } 
            else if (route.name === 'MedicationsTab') 
            {
              return <Ionicons name="medkit" size={size} color={color} />;
            }
            else if (route.name === 'TestResultsTab')
            {
              return <Ionicons name="flask-outline" size={size} color={color} />;
            }
          },
          tabBarActiveTintColor: '#2196f3',
          tabBarInactiveTintColor: 'gray',
          headerShown: true,
          tabBarStyle: { height: 90 ,  marginBottom: Platform.OS === 'android' ? 5 : 0 },
        })}
      >
        <Tab.Screen 
        name="TestResultsTab" 
        component={TestResultsScreen} 
        options={{ title: 'الفحوصات' }} 
        />

        <Tab.Screen 
        name="MedicationsTab" 
        component={PatientMedications} 
        options={{ title: 'الأدوية' }} 
        />

        <Tab.Screen 
        name="DashboardTab" 
        component={PatientDashboard} 
        options={{ title: 'لوحة التحكم' }} 
        />


      <Tab.Screen 
      name="MessagesTab" 
      component={ChatScreen} 
      options={{ title: 'الرسائل' }} 
      />
      
      </Tab.Navigator>
    </SafeAreaView>
  );
};

// ✅ محتوى Drawer مخصص مع تسجيل الخروج
function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل خروج',
          onPress: () => {
            navigation.replace('Login'); // ✅ الرجوع لشاشة تسجيل الدخول
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="تسجيل الخروج"
        onPress={handleLogout}
        icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
      />
    </DrawerContentScrollView>
  );
}

// ✅ Drawer Navigator
const NavigatorPatient = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#2196f3',
        drawerInactiveTintColor: 'gray',
      }}
    >
      <Drawer.Screen
        name="Home"
        component={BottomTabs}
        options={{
          title: 'الرئيسية',
          headerShown: false,
          drawerIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Education"
        component={EducationalContentScreen}
        options={{
          title: 'المحتوى التثقيفي',
          drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="Feedback"
        component={FeedbackScreen}
        options={{
          title: 'تقييم جودة الخدمات',
          drawerIcon: ({ color, size }) => <Ionicons name="thumbs-up-outline" size={size} color={color} />,
        }}
      />
      <Drawer.Screen
        name="اعادة تعيين كلمة المرور"
        component={ChangePasswordScreen}
        options={{
          title: 'اعادة تعيين كلمة المرور' ,
          drawerIcon: ({ color, size }) => <Ionicons name="key-outline" size={size} color={color} />,
        }}
      />

    </Drawer.Navigator>
  );
};

export default NavigatorPatient;
