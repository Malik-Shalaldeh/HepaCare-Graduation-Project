// screensAdmin/UpdateUserPasswordScreen.js
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

const PRIMARY = '#00b29c';      // أخضر أساسي

export default function UpdateUserPasswordScreen() {
  const [nid, setNid]           = useState('');
  const [user, setUser]         = useState(null);
  const [pass1, setPass1]       = useState('');
  const [pass2, setPass2]       = useState('');
  const [showPass1, setShow1]   = useState(false);
  const [showPass2, setShow2]   = useState(false);

  // بيانات تجريبية
  const USERS = [
  { id: 'D165', nationalId: '402335489', name: 'د.ايه تفاحة' },
  { id: 'D1001', nationalId: '4023456789', name: 'د. أحمد خالد' },
  { id: 'D1002', nationalId: '4098765432', name: 'د. سارة محمود' },
  { id: 'D1003', nationalId: '4011122233', name: 'د. معاذ حسان' },
  ];

  const onSearch = () => {
    if (!nid) {
       Alert.alert('تنبيه', 'أدخل رقم الهوية'); return; 
      }

    const found = USERS.find(u => u.nationalId === nid.trim());

    if (!found) {
        setUser(null);
        Alert.alert('غير موجود', 'لا يوجد مستخدم بهذا الرقم'); 
        return;
       }

    setUser(found);
    setPass1('');
    setPass2('');
    setShow1(false);
    setShow2(false);
  };

  const onUpdate = () => 
    {
    if (!user) {
       Alert.alert('تنبيه', 'ابحث عن المستخدم أولاً'); 
       return; 
      }
    if (!pass1 || !pass2) {
       Alert.alert('تنبيه', 'أدخل كلمة المرور ثم أكدها'); 
       return; 
      }
    if (pass1 !== pass2) {
       Alert.alert('تنبيه', 'كلمتا المرور غير متطابقتين'); 
       return; 
      }
      
    // TODO: نداء API
    Alert.alert('تم التحديث', `تم تحديث كلمة مرور: ${user.name}`);
    setUser(null);
    setNid('');
    setPass1('');
    setPass2('');
    setShow1(false);
    setShow2(false);
  };

  const disabled = !user || !pass1 || !pass2;

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>رقم الهوية</Text>

      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#64748B" />
        <TextInput
          style={styles.input}
          placeholder="ابحث برقم الهوية"
          placeholderTextColor="#94A3B8"
          value={nid}
          onChangeText={setNid}
          keyboardType="number-pad"
          textAlign="right"
        />
        <TouchableOpacity onPress={onSearch} activeOpacity={0.85} style={styles.searchBtn}>
          <Ionicons name="search-outline" size={18} color="#FFFFFF" />
       </TouchableOpacity>
      </View>

      {user && (
        <View style={styles.userCard}>
          <Ionicons name="person-circle-outline" size={24} color={PRIMARY} style={styles.userIcon} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userMeta}>رقم الهوية: {user.nationalId}</Text>
          </View>
        </View>
      )}

      {user && (
        <>
          <Text style={styles.label}>كلمة المرور الجديدة</Text>
          <View style={styles.passRow}>
            <Ionicons name="lock-closed-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.passInput}
              placeholder="أدخل كلمة المرور"
              placeholderTextColor="#94A3B8"
              value={pass1}
              onChangeText={setPass1}
              secureTextEntry={!showPass1}
              textAlign="right"
            />
            <TouchableOpacity onPress={() => setShow1(v => !v)} activeOpacity={0.8} style={styles.eyeBtn}>
              <Ionicons name={showPass1 ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>تأكيد كلمة المرور</Text>
          <View style={styles.passRow}>
            <Ionicons name="lock-closed-outline" size={18} color={PRIMARY} />
            <TextInput
              style={styles.passInput}
              placeholder="أعد إدخال كلمة المرور"
              placeholderTextColor="#94A3B8"
              value={pass2}
              onChangeText={setPass2}
              secureTextEntry={!showPass2}
              textAlign="right"
            />
            <TouchableOpacity onPress={() => setShow2(v => !v)} activeOpacity={0.8} style={styles.eyeBtn}>
              <Ionicons name={showPass2 ? 'eye-off-outline' : 'eye-outline'} size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onUpdate}
            activeOpacity={0.9}
            disabled={disabled}
            style={[styles.updateBtn, disabled && { opacity: 0.5 }]}
          >
            <Ionicons name="key-outline" size={16} color="#FFFFFF" />
            <Text style={styles.updateText}>تحديث كلمة المرور</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    alignItems: 'center',
  },
  label: {
    color: '#0F172A',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    alignSelf: 'flex-end',
    marginBottom: 6,
    marginTop: 8,
    width: '88%',
  },
  searchRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    width: '88%',
  },
  input: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    textAlign: 'right',
  },
  searchBtn: {
    backgroundColor: PRIMARY,
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    width: '88%',
    marginTop: 10,
    marginBottom: 6,
  },
  userIcon: {
    marginLeft: 6,
  },
  userInfo: {
    flex: 1,
    alignItems: 'flex-end',
  },
  userName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    textAlign: 'right',
    width: '100%',
  },
  userMeta: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'right',
    width: '100%',
  },
  passRow: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    width: '88%',
  },
  passInput: {
    flex: 1,
    color: '#0F172A',
    fontSize: 15,
    textAlign: 'right',
  },
  eyeBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    minWidth: 170,
  },
  updateText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginStart: 6,
  },
});
