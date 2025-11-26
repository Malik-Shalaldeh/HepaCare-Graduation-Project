import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await axios.post(ENDPOINTS.AUTH.LOGIN, {
        username,
        password,
      });

      const data = response.data;

      if (data.is_active === 0) {
        Alert.alert('الحساب معطل', 'هذا الحساب معطل، تواصل مع الإدارة.');
        setPassword('');
        return;
      }

      await AsyncStorage.setItem('user_id', String(data.id));

      if (data.role === 'DOCTOR') {
        await AsyncStorage.setItem('doctor_id', String(data.id));
        await AsyncStorage.setItem('patientId', '');
      } 
      else if (data.role === 'PATIENT') {
        await AsyncStorage.removeItem('doctor_id');
        await AsyncStorage.setItem('patientId', String(data.id));
      }

      navigation.replace(data.route);
    } 
    catch (e) {
      if (e.response) {
        if (e.response.status === 403) {
          Alert.alert('الحساب معطل', 'هذا الحساب معطل، تواصل مع الإدارة.');
        } 
        else if (e.response.status === 401) {
          Alert.alert('خطأ', 'اسم المستخدم أو كلمة المرور غير صحيحة');
        } 
        else {
          Alert.alert('خطأ', 'حدث خطأ في تسجيل الدخول');
        }
      } 
      else {
        Alert.alert('خطأ', 'تعذر الاتصال بالخادم');
      }
      setPassword('');
    }
  };

  return (
    <View
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* الهيدر */}
      <View
        style={styles.header}
      >
        <Text
          style={styles.logo}
        >
          HepaCare
        </Text>
      </View>

      {/* النموذج */}
      <View style={styles.form}>
        {/* حقل اسم المستخدم */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={20}
            color={theme.colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="اسم المستخدم"
            placeholderTextColor={theme.colors.textMuted}
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            textAlign="right"
            autoCapitalize="none"
          />
        </View>

        {/* حقل كلمة المرور */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="lock-closed-outline"
            size={20}
            color={theme.colors.textMuted}
            style={styles.inputIcon}
          />
          <TextInput
            placeholder="كلمة المرور"
            placeholderTextColor={theme.colors.textMuted}
            style={[styles.input, { flex: 1 }]}
            secureTextEntry={!showPassword}
            onChangeText={setPassword}
            value={password}
            textAlign="right"
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            activeOpacity={0.8}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
        </View>

        {/* زر الدخول */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          activeOpacity={0.9}
        >
          <Text
            style={styles.buttonText}
          >
            دخول
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    height: 180,
    backgroundColor: theme.colors.primary,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  logo: {
    fontSize: theme.typography.headingLg,
    fontWeight: 'bold',
    color: theme.colors.buttonPrimaryText,
    fontFamily: theme.typography.fontFamily,
  },
  form: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    ...theme.shadows.light,
  },
  inputIcon: {
    marginLeft: theme.spacing.sm,
  },
  input: {
    height: 50,
    flex: 1,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  eyeButton: {
    padding: theme.spacing.xs,
  },
  button: {
    height: 52,
    backgroundColor: theme.colors.buttonPrimary,
    borderRadius: theme.radii.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadows.light,
  },
  buttonText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
});
