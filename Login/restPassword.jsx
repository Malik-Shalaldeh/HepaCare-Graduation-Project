import { useState, useLayoutEffect } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const primary = '#00b29c';
const API_URL = 'http://192.168.1.14:8000/auth/change-password';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSave = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('⚠️ تنبيه', 'يرجى ملء جميع الحقول.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('⚠️ خطأ', 'كلمة المرور الجديدة وتكرارها غير متطابقتين.');
      return;
    }

    try {
      const user_id = await AsyncStorage.getItem('user_id');
      if (!user_id) {
        Alert.alert('⚠️ خطأ', 'لم يتم العثور على رقم المستخدم، يرجى تسجيل الدخول مجددًا.');
        return;
      }

      const url = `${API_URL}?user_id=${user_id}&current_password=${encodeURIComponent(currentPw)}&new_password=${encodeURIComponent(newPw)}`;
      const res = await fetch(url, { method: 'POST' });

      if (res.ok) {
        Alert.alert('✅ تم تغيير كلمة المرور بنجاح');
        setCurrentPw('');
        setNewPw('');
        setConfirmPw('');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      } else {
        const data = await res.json();
        Alert.alert('⚠️ خطأ', data.detail || 'فشل تغيير كلمة المرور');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('⚠️ خطأ', 'تعذر الاتصال بالخادم، تحقق من الشبكة.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={primary} />
      </TouchableOpacity>

      <Text style={styles.title}>تغيير كلمة المرور</Text>

      <Text style={styles.label}>كلمة المرور الحالية</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry={!showCurrent}
          value={currentPw}
          onChangeText={setCurrentPw}
        />
        <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
          <Ionicons
            name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>كلمة المرور الجديدة</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry={!showNew}
          value={newPw}
          onChangeText={setNewPw}
        />
        <TouchableOpacity onPress={() => setShowNew(!showNew)}>
          <Ionicons
            name={showNew ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>تأكيد كلمة المرور الجديدة</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry={!showConfirm}
          value={confirmPw}
          onChangeText={setConfirmPw}
        />
        <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
          <Ionicons
            name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 حفظ </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
  },
  backBtn: {
    marginBottom: 20,
    marginLeft: 10,
    marginVertical: 25,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
    textAlign: 'right',
    fontWeight: '600',
    marginHorizontal: 15,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderColor: primary,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 20,
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
    textAlign: 'right',
  },
  button: {
    backgroundColor: primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: primary,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    marginHorizontal: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
