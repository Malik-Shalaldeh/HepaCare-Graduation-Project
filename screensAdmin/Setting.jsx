import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import theme from '../style/theme';

export default function Setting() {
  const navigation = useNavigation();

  const onResetUser = () => {
    navigation.navigate('UpdateUserPasswordScreen');
  };

  const onResetAdmin = () => {
    navigation.navigate('ChangePasswordScreen');
  };

  const Logout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'تسجيل خروج',
          onPress: () => navigation.navigate('Login'),
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      <View style={styles.container}>
        <Text style={styles.title}>الإعدادات</Text>

        <TouchableOpacity
          style={[styles.btn, styles.btnPrimary]}
          onPress={onResetUser}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="key-outline" size={22} color={theme.colors.buttonPrimaryText} />
            <Text style={styles.btnText}>تحديث كلمة مرور مستخدم</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnSecondary]}
          onPress={onResetAdmin}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="shield-checkmark-outline" size={22} color={theme.colors.buttonPrimaryText} />
            <Text style={styles.btnText}>إعادة تعيين كلمة مرور الأدمن</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnOutline]}
          onPress={Logout}
          activeOpacity={0.9}
        >
          <View style={styles.btnContent}>
            <Ionicons name="exit-outline" size={22} color={theme.colors.buttonOutlineText} />
            <Text style={[styles.btnText, { color: theme.colors.buttonOutlineText }]}>
              تسجيل الخروج
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  container: {
    flex: 1,
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.headingLg,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.lg * 2,
    fontFamily: theme.typography.fontFamily,
  },
  btn: {
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  btnPrimary: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  btnSecondary: {
    backgroundColor: theme.colors.buttonSecondary,
  },
  btnOutline: {
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: theme.colors.buttonOutlineBorder,
  },
  btnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  btnText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: '700',
    fontFamily: theme.typography.fontFamily,
  },
});
