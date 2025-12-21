// ChangePasswordScreen.js
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

const ChangePasswordScreen = () => {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);


  const handleSave = async () => {
    if (!currentPw || !newPw || !confirmPw) {
    Alert.alert('⚠️ تنبيه', 'يرجى إدخال كلمة المرور الحالية والجديدة وتأكيدها.');
    return;
   }

    if (!newPw || !confirmPw) {
      Alert.alert('⚠️ تنبيه', 'يرجى إدخال كلمة المرور الجديدة وتأكيدها.');
      return;
    }

    if (newPw.length < 4) {
      Alert.alert('⚠️ تنبيه', 'كلمة المرور يجب أن تكون 4 أحرف على الأقل.');
      return;
    }

    if (newPw !== confirmPw) {
      Alert.alert('⚠️ خطأ', 'كلمة المرور الجديدة وتأكيدها غير متطابقتين.');
      return;
    }

    try {
      const user_id = await AsyncStorage.getItem('user_id');

      if (!user_id) {
        Alert.alert('⚠️ خطأ', 'لم يتم العثور على رقم المستخدم، يرجى تسجيل الدخول مجددًا.');
        return;
      }

      const res = await axios.post(ENDPOINTS.AUTH.CHANGE_PASSWORD,
      {},
      {
        params: {
          user_id,
          current_password: currentPw,
          new_password: newPw,
        },
      }
    );


      if (res.status === 200) {
        Alert.alert('✅ نجاح', 'تم تغيير كلمة المرور بنجاح.');
        setNewPw('');
        setConfirmPw('');
        setShowNew(false);
        setShowConfirm(false);
      }
    } catch (error) {
      if (error.response?.data?.detail) {
        Alert.alert('⚠️ خطأ', error.response.data.detail);
      } else {
        Alert.alert('⚠️ خطأ', 'تعذر الاتصال بالخادم.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      {/* كلمة المرور الحالية */}
      <Text style={styles.label}>كلمة المرور الحالية</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={!showCurrent}
          value={currentPw}
          onChangeText={setCurrentPw}
          textAlign="right"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
          <Ionicons
            name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>


      {/* كلمة المرور الجديدة */}
      <Text style={styles.label}>كلمة المرور الجديدة</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={!showNew}
          value={newPw}
          onChangeText={setNewPw}
          textAlign="right"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Ionicons
            name={showNew ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* تأكيد كلمة المرور */}
      <Text style={styles.label}>تأكيد كلمة المرور</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          placeholderTextColor={theme.colors.textMuted}
          secureTextEntry={!showConfirm}
          value={confirmPw}
          onChangeText={setConfirmPw}
          textAlign="right"
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons
            name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* زر الحفظ */}
      <TouchableOpacity
        style={styles.button}
        onPress={handleSave}
        activeOpacity={0.9}
      >
        <Text style={styles.buttonText}>🔐 حفظ كلمة المرور</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.headingMd,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    fontFamily: theme.typography.fontFamily,
  },
  label: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
    fontWeight: '600',
    marginHorizontal: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    marginHorizontal: theme.spacing.md,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.bodyLg,
    paddingVertical: theme.spacing.sm,
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  button: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    marginHorizontal: theme.spacing.md,
  },
  buttonText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
});

export default ChangePasswordScreen;
