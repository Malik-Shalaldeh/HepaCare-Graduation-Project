// screensAdmin/AddNewDoctorScreen.js
import { useState } from 'react';
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
const API = 'http://192.168.1.9:8000';

export default function AddNewDoctorScreen() {
  const [doctorId, setDoctorId] = useState('');    // 👈 رقم الهوية (سيُخزّن كـ doctor_id)
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [phone, setPhone] = useState('');
  const [saving, setSaving] = useState(false);

  const validate = () => {
    if (!doctorId.trim() || !name.trim() || !clinicName.trim() || !phone.trim()) {
      Alert.alert('تنبيه', 'رجاءً املأ جميع الحقول');
      return false;
    }
    // رقم الهوية: أرقام فقط وطول معقول
    if (!/^\d{6,15}$/.test(doctorId.trim())) {
      Alert.alert('تنبيه', 'رقم الهوية يجب أن يتكون من أرقام فقط (6 إلى 15 رقم).');
      return false;
    }
    // هاتف فلسطيني 10 خانات يبدأ بـ 05
    const p = phone.trim();
    if (!(p.length === 10 && p.startsWith('05') && /^\d+$/.test(p))) {
      Alert.alert('تنبيه', 'رقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validate()) return;
    try {
      setSaving(true);
      const res = await axios.post(`${API}/admin/doctors`, {
        doctor_id: doctorId.trim(),         // 👈 نرسل رقم الهوية كـ doctor_id
        full_name: name.trim(),
        clinic_name: clinicName.trim(),
        phone: phone.trim(),
      });
      Alert.alert('تم الحفظ', `تمت إضافة: ${res.data.full_name} (رقم: ${res.data.doctor_id})`);
      setDoctorId('');
      setName('');
      setClinicName('');
      setPhone('');
    } catch (e) {
      console.error(e);
      const msg = e?.response?.data?.detail || 'تعذر إضافة الطبيب';
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
        placeholder="مثال: Main Clinic أو عيادة السلام"
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
        <Ionicons name="save-outline" size={16} color="#fff" />
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
    paddingHorizontal: 14,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    minWidth: 150,
  },
  saveText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800', marginStart: 6 },
});
