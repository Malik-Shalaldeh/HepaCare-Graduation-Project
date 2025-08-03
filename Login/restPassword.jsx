import React, { useState, useLayoutEffect } from 'react';
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

const primary = '#00b29c';

const ChangePasswordScreen = () => {
  const navigation = useNavigation();

  // حقول كلمات المرور
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  // حالات إظهار/إخفاء كلمة المرور
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // إخفاء الهيدر (Drawer يحتوي الهيدر)
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSave = () => {
    if (!currentPw || !newPw || !confirmPw) {
      Alert.alert('⚠️ تنبيه', 'يرجى ملء جميع الحقول.');
      return;
    }
    if (newPw !== confirmPw) {
      Alert.alert('⚠️ خطأ', 'كلمة المرور الجديدة وتكرارها غير متطابقتين.');
      return;
    }
    // تنفيذ منطق تغيير كلمة المرور هنا
    Alert.alert('✅ تم تغيير كلمة المرور بنجاح');
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    setShowCurrent(false);
    setShowNew(false);
    setShowConfirm(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar  barStyle="dark-content" />

      {/* زر الرجوع */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color={primary} />
      </TouchableOpacity>

      <Text style={styles.title}>تغيير كلمة المرور</Text>

      {/* عنوان وكلمة المرور الحالية */}
      <Text style={styles.label}>كلمة المرور الحالية</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry={!showCurrent}
          value={currentPw}
          onChangeText={setCurrentPw}
        />
        <TouchableOpacity onPress={() => setShowCurrent(prev => !prev)}>
          <Ionicons
            name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      {/* عنوان وكلمة المرور الجديدة */}
      <Text style={styles.label}>كلمة المرور الجديدة</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry={!showNew}
          value={newPw}
          onChangeText={setNewPw}
        />
        <TouchableOpacity onPress={() => setShowNew(prev => !prev)}>
          <Ionicons
            name={showNew ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      {/* عنوان وتأكيد كلمة المرور */}
      <Text style={styles.label}>تأكيد كلمة المرور الجديدة</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="••••••••"
          secureTextEntry={!showConfirm}
          value={confirmPw}
          onChangeText={setConfirmPw}
        />
        <TouchableOpacity onPress={() => setShowConfirm(prev => !prev)}>
          <Ionicons
            name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={primary}
          />
        </TouchableOpacity>
      </View>

      {/* زر حفظ التغيير */}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>💾 حفظ التغيير</Text>
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
    marginVertical:25
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
    marginHorizontal:15
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
    marginHorizontal:15
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
    marginHorizontal:15

  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    
  },
});

export default ChangePasswordScreen;
