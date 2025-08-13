// screensAdmin/AddNewDoctorScreen.js
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#00b29c';

export default function AddNewDoctorScreen() 
{
  const [name, setName] = useState('');
  const [nid, setNid] = useState('');
  const [clinic, setClinic] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState(new Date(1990, 0, 1));
  const [birthText, setBirthText] = useState('اختر تاريخ الميلاد');
  const [showPicker, setShowPicker] = useState(false);

  const formatDate = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${dd}`;
  };

  const onPickDate = (event, selected) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    if (selected) {
      setBirthDate(selected);
      setBirthText(formatDate(selected));
    }
  };

  const openPicker = () => {
    setShowPicker(true);
  };

  const onSave = () => {
    
  if (!name || !nid || !clinic || !phone || birthText === 'اختر تاريخ الميلاد' ||
    phone.length !== 10 || !phone.startsWith('05') || isNaN(phone)) {
  Alert.alert('تنبيه', 'رجاءً املأ جميع الحقول، ورقم الهاتف يجب أن يكون 10 أرقام ويبدأ بـ 05');
  return;
}

    Alert.alert('تم الحفظ', 'تم إضافة الطبيب بنجاح');
    setName('');
    setNid('');
    setClinic('');
    setPhone('');
    setBirthDate(new Date(1990, 0, 1));
    setBirthText('اختر تاريخ الميلاد');
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>اسم الطبيب</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: أحمد خالد"
        placeholderTextColor="#9AA4AF"
        value={name}
        onChangeText={setName}
        textAlign="right"
      />

      <Text style={styles.label}>رقم الهوية</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 4023456789"
        placeholderTextColor="#9AA4AF"
        value={nid}
        onChangeText={setNid}
        keyboardType="number-pad"
        textAlign="right"
      />

      <Text style={styles.label}>اسم العيادة</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: عيادة السلام"
        placeholderTextColor="#9AA4AF"
        value={clinic}
        onChangeText={setClinic}
        textAlign="right"
      />

      <Text style={styles.label}>تاريخ الميلاد</Text>
      <TouchableOpacity onPress={openPicker} activeOpacity={0.9} style={styles.dateField}>
        <Ionicons name="calendar-outline" size={18} color={PRIMARY} />
        <Text style={styles.dateText}>{birthText}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={birthDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={onPickDate}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>رقم الهاتف</Text>
      <TextInput
        style={styles.input}
        placeholder="مثال: 0591234567"
        placeholderTextColor="#9AA4AF"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
        textAlign="right"
      />

      <TouchableOpacity onPress={onSave} activeOpacity={0.9} style={styles.saveBtn}>
        <Ionicons name="save-outline" size={16} color="#fff" />
        <Text style={styles.saveText}>حفظ الطبيب</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    alignItems: 'center',
  },
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
  dateField: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '85%',
  },
  dateText: {
    color: '#2C3E50',
    fontSize: 15,
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
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginStart: 6,
  },
});
