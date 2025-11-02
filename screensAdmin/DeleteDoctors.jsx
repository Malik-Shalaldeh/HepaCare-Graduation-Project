import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const PRIMARY = '#00b29c';
const API = 'http://192.168.1.120:8000';

export default function ToggleDoctorScreen() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔍 البحث
  const handleSearch = async () => {
    if (!search.trim()) {
      Alert.alert("تنبيه", "أدخل اسم الطبيب أو رقمه");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(`${API}/admin/search-doctors`, {
        params: { q: search.trim() }
      });
      setResults(res.data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // 🚫 تعطيل / تفعيل
  const handleToggle = () => {
    if (!selected) return;
    const action = selected.is_active ? "تعطيل" : "تفعيل";
    Alert.alert(
      'تأكيد العملية',
      `هل تريد ${action} ${selected.name} (رقم: ${selected.id})؟`,
      [
        { text: 'إلغاء' },
        {
          text: action,
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await axios.put(`${API}/admin/doctors/${selected.id}/toggle`);
              Alert.alert('تم', res.data.message);

              // تحديث القائمة
              setResults(results.map(d =>
                d.id === selected.id ? { ...d, is_active: res.data.new_status } : d
              ));
              setSelected(null);
              setSearch('');
            } catch {
              Alert.alert('خطأ', 'تعذر تنفيذ العملية');
            }
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    let active = false;
    if (selected && selected.id === item.id) {
      active = true;
    }

    return (
      <TouchableOpacity
        onPress={() => setSelected(item)}
        activeOpacity={0.85}
        style={[
          styles.card,
          active && { borderColor: PRIMARY, backgroundColor: '#E6FFFA' },
        ]}
      >

        <Ionicons
          name="person-outline"
          size={18}
          color={active ? PRIMARY : '#6B7280'}
          style={styles.cardIcon}
        />

        <View style={styles.infoBox}>
          <Text style={[styles.name, active && { color: PRIMARY }]}>{item.name}</Text>
          <Text style={styles.meta}>الرقم: {item.id}</Text>
          <Text style={styles.meta}>الهاتف: {item.phone}</Text>
          <Text style={styles.meta}>العيادة: {item.clinic}</Text>
          <Text style={[styles.meta, { color: item.is_active ? 'green' : 'red' }]}>
            {item.is_active ? '✅ مفعل' : '⛔ معطل'}
          </Text>
        </View>


      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar backgroundColor={PRIMARY} barStyle="light-content" />

      {/* مربع البحث */}
      <View style={styles.searchRow}>

        <Ionicons name="search" size={18} color="#6B7280" />

        <TextInput
          style={styles.input}
          placeholder="ابحث بالاسم أو رقم الطبيب"
          placeholderTextColor="#9AA4AF"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
          onSubmitEditing={handleSearch}
        />

        <TouchableOpacity onPress={handleSearch} activeOpacity={0.8} style={styles.searchBtn}>
          <Ionicons name="search-outline" size={18} color="#fff" />
        </TouchableOpacity>

      </View>

      {loading && <ActivityIndicator size="large" color={PRIMARY} style={{ marginTop: 20 }} />}

      {/* القائمة */}
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={!loading && <Text style={styles.empty}>لا توجد نتائج مطابقة.</Text>}
      />

      {/* زر التعطيل / التفعيل */}
      <TouchableOpacity
        onPress={handleToggle}
        disabled={!selected}
        activeOpacity={0.9}
        style={[styles.disableBtn, !selected && { opacity: 0.5 }]}
      >

        <Ionicons name={selected?.is_active ? "close-circle-outline" : "checkmark-circle-outline"} size={16} color="#fff" />
        <Text style={styles.disableText}>
          {selected?.is_active ? "تعطيل الحساب" : "إلغاء التعطيل"}
        </Text>
        
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F6FAF9',
    padding: 16,
  },
  searchRow: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: '#2C3E50',
    fontSize: 15,
    textAlign: 'right',
  },
  searchBtn: {
    backgroundColor: PRIMARY,
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    paddingVertical: 8,
    paddingBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
  },
  cardIcon: {
    marginLeft: 6,
  },
  infoBox: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C3E50',
    marginBottom: 2,
    textAlign: 'right',
    width: '100%',
  },
  meta: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'right',
    width: '100%',
  },
  empty: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 16,
  },
  disableBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'center',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 6,
    minWidth: 180,
    marginBottom: 100,
  },
  disableText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
