// screensAdmin/DeleteDoctorScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PRIMARY = '#00b29c';

const DOCTORS = [
  { id: 'D165', nationalId: '402335489', name: 'د.ايه تفاحة' },
  { id: 'D1001', nationalId: '4023456789', name: 'د. أحمد خالد' },
  { id: 'D1002', nationalId: '4098765432', name: 'د. سارة محمود' },
  { id: 'D1003', nationalId: '4011122233', name: 'د. معاذ حسان' },
];

export default function DeleteDoctorScreen() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const results = DOCTORS.filter(
    d => d.name.includes(search) || d.nationalId.includes(search)
  );

  const handleDelete = () => {
    if (!selected) return;
    Alert.alert(
      'تأكيد الحذف',
      `هل تريد حذف ${selected.name} (هوية: ${selected.nationalId})؟`,
      [
        { text: 'إلغاء' },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            Alert.alert('تم الحذف', `${selected.name} تم حذفه بنجاح`);
            setSelected(null);
            setSearch('');
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const active = selected?.id === item.id;
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
          <Text style={styles.meta}>رقم الهوية: {item.nationalId}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
       <StatusBar backgroundColor={PRIMARY} barStyle="dark-content" />
      
      <View style={styles.searchRow}>
        <Ionicons name="search" size={18} color="#6B7280" />
        <TextInput
          style={styles.input}
          placeholder="ابحث بالاسم أو رقم الهوية"
          placeholderTextColor="#9AA4AF"
          value={search}
          onChangeText={setSearch}
          textAlign="right"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color="#6B7280" />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={<Text style={styles.empty}>لا توجد نتائج مطابقة.</Text>}
      />

      <TouchableOpacity
        onPress={handleDelete}
        disabled={!selected}
        activeOpacity={0.9}
        style={[
          styles.deleteBtn,
          !selected && { opacity: 0.5 },
        ]}
      >
        <Ionicons name="trash-outline" size={16} color="#fff" />
        <Text style={styles.deleteText}>حذف الطبيب</Text>
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
  deleteBtn: {
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
    marginBottom:100
  },
  deleteText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
  },
});
