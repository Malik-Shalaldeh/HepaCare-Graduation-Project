import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PRIMARY = '#00b29c';
const API = 'http://192.168.1.120:8000';

export default function AddNewDoctorScreen() {
  const [doctorId, setDoctorId] = useState('');
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  // دالة التحقق من المدخلات
  const validate = () => {
    if (!doctorId.trim() || !name.trim() || !clinicName.trim() || !phone.trim()) {
      Alert.alert('تنبيه', 'رجاءً املأ جميع الحقول');
      return false;
    }
    if (!/^\d{6,15}$/.test(doctorId.trim())) {
      Alert.alert('تنبيه', 'رقم الهوية يجب أن يتكون من أرقام فقط (6 إلى 15 رقم).');
      return false;
    }
    const p = phone.trim();
    if (!(p.length === 10 && p.startsWith('05') && /^\d+$/.test(p))) {
      Alert.alert('تنبيه', 'رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05');
      return false;
    }
    return true;
  };

  // إرسال البيانات إلى السيرفر
  const onSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
        const res = await axios.post(`${API}/admin/doctors/add`,
        {
          doctor_id: doctorId.trim(),
          full_name: name.trim(),
          clinic_name: clinicName.trim(),
          phone: phone.trim(),
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const msg = res.data.message || 'تمت العملية بنجاح';
      const username = res.data.username || doctorId;
      const password = res.data.password || doctorId;

      Alert.alert(
        '✅ تم الحفظ بنجاح',
        `${msg}\n\n👤 اسم المستخدم: ${username}\n🔑 كلمة المرور: ${password}`
      );

      // تفريغ الحقول
      setDoctorId('');
      setName('');
      setClinicName('');
      setPhone('');
    } catch (e) {
      console.error(e?.response?.data || e.message);
      const msg = e?.response?.data?.detail || e?.response?.data?.message || 'تعذر إضافة الطبيب';
      Alert.alert('خطأ', msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>رقم الهوية</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 4023456789"
        placeholderTextColor="#9AA4AF"
        value={doctorId}
        onChangeText={setDoctorId}
        keyboardType="number-pad"
        textAlign="right"
      />

      <Text style={styles.label}>اسم الطبيب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: د. سارة إبراهيم"
        placeholderTextColor="#9AA4AF"
        value={name}
        onChangeText={setName}
        textAlign="right"
      />

      <Text style={styles.label}>اسم العيادة</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: عيادة السلام"
        placeholderTextColor="#9AA4AF"
        value={clinicName}
        onChangeText={setClinicName}
        textAlign="right"
      />

      <Text style={styles.label}>رقم الهاتف</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 0599000004"
        placeholderTextColor="#9AA4AF"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        textAlign="right"
        maxLength={10}
      />

      <TouchableOpacity
        onPress={onSave}
        activeOpacity={0.9}
        disabled={saving}
        style={[styles.saveBtn, saving && { opacity: 0.6 }]}
      >
        <Ionicons name="save-outline" size={18} color="#fff" />
        <Text style={styles.saveText}>{saving ? 'جارٍ الحفظ...' : 'حفظ الطبيب'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff', padding: 16, alignItems: 'center' },
  label: {
    color: '#2C3E50',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    alignSelf: 'flex-end',
    marginBottom: 6,
    marginTop: 6,
    width: '85%',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: '#2C3E50',
    fontSize: 15,
    marginBottom: 10,
    width: '85%',
  },
  saveBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 18,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    minWidth: 160,
  },
  saveText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
});
