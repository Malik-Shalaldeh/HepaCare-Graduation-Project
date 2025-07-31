import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const ResetPatientPasswordScreen = () => {
  const [patientId, setPatientId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleReset = async () => {
    if (!patientId || !newPassword || !confirmPassword) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('خطأ', 'كلمتا المرور غير متطابقتين');
      return;
    }

    setLoading(true);
    try {
      // TODO: ضع رابط الـ API الفعلي هنا
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com'}/patients/${patientId}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword }),
      });
      if (res.ok) {
        Alert.alert('تم', 'تم تغيير كلمة المرور بنجاح');
        navigation.goBack();
      } else {
        const msg = await res.text();
        Alert.alert('خطأ', msg || 'حدث خطأ ما');
      }
    } catch (err) {
      Alert.alert('خطأ', 'تعذر الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>إعادة تعيين كلمة مرور المريض</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>رقم هوية/معرّف المريض</Text>
        <TextInput
          style={styles.input}
          value={patientId}
          onChangeText={setPatientId}
          placeholder="مثال: 123456"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>كلمة المرور الجديدة</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="••••••••"
          placeholderTextColor="#999"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>تأكيد كلمة المرور</Text>
        <TextInput
          style={styles.input}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="••••••••"
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.resetButtonText}>إعادة التعيين</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  backButton: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 16, color: '#333', marginBottom: 5, textAlign: 'right' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: '#f9f9f9',
  },
  resetButton: {
    backgroundColor: '#00b29c',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  resetButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ResetPatientPasswordScreen;
