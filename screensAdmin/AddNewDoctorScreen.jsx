// screensAdmin/AddNewDoctorScreen.jsx
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
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

export default function AddNewDoctorScreen()
 {
  const [doctorId, setDoctorId] = useState('');
  const [name, setName] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [phone, setPhone] = useState('');

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
      Alert.alert('تنبيه', 'تاكد من رقم الهاتف المدخل');
      return false;
    }
    return true;
  };

  const onSave = async () => {
    if (!validate()) return;
    try {
      const res = await axios.post(
        ENDPOINTS.ADMIN.ADD_DOCTOR,
        {
          doctor_id: doctorId.trim(),
          full_name: name.trim(),
          clinic_name: clinicName.trim(),
          phone: phone.trim(),
        },
      );

      Alert.alert(
        'تم الحفظ',
        `${res.data.message }`
      );

      setDoctorId('');
      setName('');
      setClinicName('');
      setPhone('');

    } catch (e) {
        const msg = e.response?.data?.detail || 'تعذر إضافة الطبيب'; 
        Alert.alert('خطأ', msg);
    } 
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>رقم الهوية</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 4023456789"
        placeholderTextColor={theme.colors.textMuted}
        value={doctorId}
        onChangeText={setDoctorId}
        keyboardType="number-pad"
        textAlign="right"
      />

      <Text style={styles.label}>اسم الطبيب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: د. سارة إبراهيم"
        placeholderTextColor={theme.colors.textMuted}
        value={name}
        onChangeText={setName}
        textAlign="right"
      />

      <Text style={styles.label}>اسم العيادة</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: عيادة السلام"
        placeholderTextColor={theme.colors.textMuted}
        value={clinicName}
        onChangeText={setClinicName}
        textAlign="right"
      />

      <Text style={styles.label}>رقم الهاتف</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 0599000004"
        placeholderTextColor={theme.colors.textMuted}
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        textAlign="right"
        maxLength={10}
      />

      <TouchableOpacity
        onPress={onSave}
        activeOpacity={0.9}
        style={styles.saveBtn}
      >
        <Ionicons
          name="save-outline"
          size={18}
          color={theme.colors.buttonPrimaryText}
        />
        <Text style={styles.saveText}> 'حفظ الطبيب'</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  label: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyMd,
    fontWeight: '700',
    textAlign: 'right',
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    width: '85%',
    fontFamily: theme.typography.fontFamily,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodyLg,
    marginBottom: theme.spacing.sm,
    width: '85%',
    fontFamily: theme.typography.fontFamily,
  },
  saveBtn: {
    backgroundColor: theme.colors.buttonPrimary,
    borderRadius: theme.radii.pill,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.md,
    minWidth: 160,
    ...theme.shadows.light,
  },
  saveText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyMd,
    fontWeight: '800',
    fontFamily: theme.typography.fontFamily,
  },
});
