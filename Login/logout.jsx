import { Alert } from 'react-native';
import { CommonActions } from '@react-navigation/native';

const Logout = (navigation) => {
  Alert.alert(
    'تسجيل الخروج',
    'هل أنت متأكد أنك تريد تسجيل الخروج؟',
    [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'تسجيل خروج',
        style: 'destructive',
        onPress: () => {
          // مسح كل stack والرجوع للـ Login
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login' }],
            })
          );
        },
      },
    ],
    { cancelable: true }
  );
};

export default Logout;
