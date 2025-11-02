import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PRIMARY = '#00b29c';
const API = 'http://192.168.1.120:8000';

const roles = [
  { key: 'DOCTOR', label: 'طبيب' },
  { key: 'PATIENT', label: 'مريض' },
  { key: 'LAB', label: 'مختبر' },
  { key: 'MOH', label: 'وزارة الصحة' },
  { key: 'ADMIN', label: 'أدمن' },
];

export default function UpdateUserPasswordScreen() {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [pass1, setPass1] = useState('');
  const [pass2, setPass2] = useState('');

  const onChooseRole = async (r) => {
    setRole(r);
    setUser(null);
    setResults([]);
    setName('');
    if (r === 'MOH' || r === 'ADMIN') {
      try {
        const res = await axios.get(`${API}/admin/search-by-role`, { params: { role: r } });
        if (res.data.length > 0) setUser(res.data[0]);
      } catch {
        Alert.alert('خطأ', 'تعذر جلب حساب هذا الدور');
      }
    }
  };

  const onSearch = async () => {
    if (!role) {
      Alert.alert('تنبيه', 'اختر الدور أولاً');
      return;
    }
    if (!name.trim() && role !== 'MOH' && role !== 'ADMIN') {
      Alert.alert('تنبيه', 'أدخل الاسم');
      return;
    }
    try {
      const res = await axios.get(`${API}/admin/search-by-role`, { params: { role, name } });
      setResults(res.data);
    } catch {
      setResults([]);
      Alert.alert('غير موجود', 'لا يوجد نتائج مطابقة');
    }
  };

  const onSelectUser = async (id) => {
    try {
      const res = await axios.get(`${API}/admin/user-details`, { params: { user_id: id, role } });
      setUser(res.data);
      setResults([]);
    } catch {
      Alert.alert('خطأ', 'تعذر جلب تفاصيل المستخدم');
    }
  };

  const onUpdate = async () => {
    if (!user) {
      Alert.alert('تنبيه', 'اختر مستخدم أولاً');
      return;
    }
    if (!pass1 || !pass2) {
      Alert.alert('تنبيه', 'أدخل كلمة المرور');
      return;
    }
    if (pass1 !== pass2) {
      Alert.alert('تنبيه', 'كلمتا المرور غير متطابقتين');
      return;
    }
    try {
      await axios.post(`${API}/admin/update-user-password`, null, {
        params: { user_id: user.id, new_password: pass1 },
      });
      Alert.alert('تم', `تم تحديث كلمة مرور: ${user.name}`);
      setUser(null);
      setPass1('');
      setPass2('');
    } catch {
      Alert.alert('خطأ', 'تعذر تحديث كلمة المرور');
    }
  };

  return (
    <View style={styles.screen}>
      <Text style={styles.label}>اختر الدور</Text>
      <View style={styles.rolesRow}>
        {roles.map((r) => (
          <TouchableOpacity
            key={r.key}
            onPress={() => onChooseRole(r.key)}
            style={[styles.roleBtn, role === r.key && styles.roleBtnActive]}
          >
            <Text style={[styles.roleText, role === r.key && styles.roleTextActive]}>
              {r.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {role && role !== 'MOH' && role !== 'ADMIN' && (
        <>
          <Text style={styles.label}>الاسم</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث بالاسم"
              value={name}
              onChangeText={setName}
              textAlign="right"
            />
            <TouchableOpacity onPress={onSearch} style={styles.searchIcon}>
              <Ionicons name="search-outline" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => onSelectUser(item.id)} style={styles.resultItem}>
              <Text style={styles.resultText}>{item.name} ({item.role})</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {user && (
        <View style={styles.userCard}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.role === "PATIENT" && <Text style={styles.userMeta}>رقم الهوية: {user.nationalId}</Text>}
          {user.role === "DOCTOR" && <Text style={styles.userMeta}>رقم الطبيب: {user.doctorId}</Text>}
          <Text style={styles.userMeta}>الدور: {user.role}</Text>
        </View>
      )}

      {user && (
        <>
          <Text style={styles.label}>كلمة المرور الجديدة</Text>
          <TextInput
            style={styles.input}
            placeholder="كلمة المرور"
            value={pass1}
            onChangeText={setPass1}
            secureTextEntry
            textAlign="right"
          />
          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            value={pass2}
            onChangeText={setPass2}
            secureTextEntry
            textAlign="right"
          />
          <TouchableOpacity onPress={onUpdate} style={styles.updateBtn}>
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
    padding: 16 
  },

  label: { 
    fontSize: 14, 
    fontWeight: '700', 
    marginBottom: 6, 
    textAlign: 'right', 
    color: '#0F172A' 
  },

  rolesRow: { 
    flexDirection: 'row-reverse', 
    flexWrap: 'wrap', 
    marginBottom: 10 
  },

  roleBtn: { 
    paddingVertical: 6, 
    paddingHorizontal: 12, 
    margin: 4, 
    borderWidth: 1, 
    borderColor: '#CBD5E1', 
    borderRadius: 8 
  },

  roleBtnActive: { 
    backgroundColor: PRIMARY, 
    borderColor: PRIMARY 
  },

  roleText: { 
    color: '#0F172A', 
    fontSize: 13 
  },

  roleTextActive: { 
    color: '#FFFFFF' 
  },

  searchBox: { 
    flexDirection: 'row-reverse', 
    alignItems: 'center', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 10, 
    overflow: 'hidden', 
    marginBottom: 10 
  },

  searchInput: { 
    flex: 1, 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    fontSize: 14, 
    color: '#0F172A' 
  },

  searchIcon: { 
    backgroundColor: PRIMARY, 
    padding: 10, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },

  resultItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#E2E8F0' 
  },

  resultText: { 
    textAlign: 'right', 
    color: '#0F172A', 
    fontSize: 14 
  },

  userCard: { 
    padding: 12, 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 10, 
    marginVertical: 10, 
    backgroundColor: '#F8FAFC' 
  },

  userName: { 
    fontSize: 16, 
    fontWeight: '800', 
    marginBottom: 4, 
    textAlign: 'right', 
    color: '#0F172A' 
  },

  userMeta: { 
    fontSize: 13, 
    color: '#475569', 
    textAlign: 'right' 
  },

  input: { 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 8, 
    paddingVertical: 6, 
    paddingHorizontal: 10, 
    fontSize: 14, 
    marginBottom: 8, 
    color: '#0F172A' 
  },

  updateBtn: { 
    backgroundColor: PRIMARY, 
    paddingVertical: 10, 
    borderRadius: 8, 
    alignItems: 'center', 
    marginTop: 10 
  },

  updateText: { 
    color: '#FFFFFF', 
    fontWeight: '700', 
    fontSize: 14 
  },

});
