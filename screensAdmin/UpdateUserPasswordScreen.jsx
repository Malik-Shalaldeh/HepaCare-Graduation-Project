import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

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
        const res = await axios.get(ENDPOINTS.ADMIN.SEARCH_BY_ROLE, {
          params: { role: r },
        });
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
      const res = await axios.get(ENDPOINTS.ADMIN.SEARCH_BY_ROLE, {
        params: { role, name },
      });
      setResults(res.data);
    } catch {
      setResults([]);
      Alert.alert('غير موجود', 'لا يوجد نتائج مطابقة');
    }
  };

  const onSelectUser = async (id) => {
    try {
      const res = await axios.get(ENDPOINTS.ADMIN.USER_DETAILS, {
        params: { user_id: id, role },
      });
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
      await axios.post(
        ENDPOINTS.ADMIN.UPDATE_USER_PASSWORD,
        null,
        {
          params: { user_id: user.id, new_password: pass1 },
        }
      );
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
            style={[
              styles.roleBtn,
              role === r.key && styles.roleBtnActive,
            ]}
          >
            <Text
              style={[
                styles.roleText,
                role === r.key && styles.roleTextActive,
              ]}
            >
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
              placeholderTextColor={theme.colors.textMuted}
            />
            <TouchableOpacity onPress={onSearch} style={styles.searchIcon}>
              <Ionicons name="search-outline" size={18} color={theme.colors.buttonPrimaryText} />
            </TouchableOpacity>
          </View>
        </>
      )}

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => onSelectUser(item.id)}
              style={styles.resultItem}
            >
              <Text style={styles.resultText}>
                {item.name} ({item.role})
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {user && (
        <View style={styles.userCard}>
          <Text style={styles.userName}>{user.name}</Text>
          {user.role === 'PATIENT' && (
            <Text style={styles.userMeta}>رقم الهوية: {user.nationalId}</Text>
          )}
          {user.role === 'DOCTOR' && (
            <Text style={styles.userMeta}>رقم الطبيب: {user.doctorId}</Text>
          )}
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
            placeholderTextColor={theme.colors.textMuted}
          />
          <TextInput
            style={styles.input}
            placeholder="تأكيد كلمة المرور"
            value={pass2}
            onChangeText={setPass2}
            secureTextEntry
            textAlign="right"
            placeholderTextColor={theme.colors.textMuted}
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
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: 'center',            // نمركز المحتوى
  },

  label: {
    fontSize: theme.typography.bodyMd,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    alignSelf: 'flex-end',
    width: '100%',
    maxWidth: 480,
  },

  rolesRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
    width: '100%',
    maxWidth: 480,
    justifyContent: 'flex-end',
  },

  roleBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm + 4,
    margin: theme.spacing.xs / 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.background,
  },

  roleBtnActive: {
    backgroundColor: theme.colors.buttonPrimary,
    borderColor: theme.colors.buttonPrimary,
  },

  roleText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySm,
    fontFamily: theme.typography.fontFamily,
  },

  roleTextActive: {
    color: theme.colors.buttonPrimaryText,
  },

  searchBox: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xl,         // أكتر نعومة
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    width: '100%',
    maxWidth: 480,
  },

  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.bodySm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },

  searchIcon: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },

  resultItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: theme.colors.background,
  },

  resultText: {
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySm,
    fontFamily: theme.typography.fontFamily,
  },

  userCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    ...theme.shadows.light,
  },

  userName: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
    textAlign: 'right',
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },

  userMeta: {
    fontSize: theme.typography.bodySm,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,         // مربعات ناعمة
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.bodySm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.colors.backgroundLight,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    textAlign: 'right',
  },

  updateBtn: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: theme.spacing.md,
    borderRadius: 999,                    // زر كبسولة
    alignItems: 'center',
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    width: '100%',
    maxWidth: 260,
    alignSelf: 'center',
    ...theme.shadows.light,
  },

  updateText: {
    color: theme.colors.buttonPrimaryText,
    fontWeight: '700',
    fontSize: theme.typography.bodyMd,
    fontFamily: theme.typography.fontFamily,
  },
});

