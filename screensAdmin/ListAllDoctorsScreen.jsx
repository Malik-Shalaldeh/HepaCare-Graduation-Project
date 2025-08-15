// screensAdmin/DoctorsListScreen.js
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function AllDoctorsScreen() {
  const [search, setSearch] = useState('');

  // بيانات تجريبية (استبدلها ببيانات API) clinic
  const DOCTORS = [
  { id: 'D165', nationalId: '402335489', name: 'د.ايه تفاحة' ,clinic:"عيادة السلام"},
  { id: 'D1001', nationalId: '4023456789', name: 'د. أحمد خالد',clinic:"صحة يطا" },
  { id: 'D1002', nationalId: '4098765432', name: 'د. سارة محمود',clinic:"صحة سعير" },
  { id: 'D1003', nationalId: '4011122233', name: 'د. معاذ حسان',clinic:"عيادة السلام" },
  ];

  const results = DOCTORS.filter(d =>
    d.name.includes(search) ||
    d.nationalId.includes(search) ||
    d.clinic.includes(search)
  );

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons
        name="medkit-outline"
        size={18}
        color="#00b29c"
        style={styles.cardIcon}
      />
      <View style={styles.infoBox}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>رقم الهوية: {item.nationalId}</Text>
        <Text style={styles.meta}>العيادة: {item.clinic}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.screen}>
      {/* مربع البحث */}
      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={18}
          color="#6B7280"
        />
        <TextInput
          style={styles.input}
          placeholder="ابحث بالاسم أو رقم الهوية أو العيادة"
          placeholderTextColor="#9AA4AF"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />

      </View>

      {/* القائمة */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد نتائج مطابقة.</Text>}
      />
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

  searchRow: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 12,
    width: '85%',
  },

  input: {
    flex: 1,
    color: '#2C3E50',
    fontSize: 15,
    textAlign: 'right',
  },

  listContainer: {
    paddingTop: 4,
    paddingBottom: 16,
    rowGap: 10,
    width: '100%',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E6E8EC',
    paddingVertical: 12,
    paddingHorizontal: 12,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 8,
    width: '85%',
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
    fontWeight: '800',
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
});
