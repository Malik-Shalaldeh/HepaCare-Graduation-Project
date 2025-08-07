// sami - واجهة المختبرات المعتمدة
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// بيانات تجريبية لمختبرات معتمدة
const LABS_DATA = [
  { id: '1', name: 'مختبر القدس الطبي', city: 'الخليل', location: 'شارع الجامعة', phone: '0599000001' },
  { id: '2', name: 'مختبر رام الله المركزي', city: 'رام الله', location: 'دوار المنارة', phone: '0599000002' },
  { id: '3', name: 'مختبر نابلس الحديث', city: 'نابلس', location: 'شارع فيصل', phone: '0599000003' },
  { id: '4', name: 'مختبر الخليل الحديث', city: 'الخليل', location: 'الحاووز', phone: '0599000004' },
  { id: '5', name: 'مختبر بيت لحم الوطني', city: 'بيت لحم', location: 'قرب المستشفى', phone: '0599000005' },
];

const LabsScreen = ({ route }) => {
  // لو جتنا المدينة من الباراميتر، بنفلتر المختبرات
  const cityParam = route?.params?.city;
  const [search, setSearch] = useState(cityParam || '');

  // فلترة المختبرات حسب المدينة
  const filteredLabs = search.trim()
    ? LABS_DATA.filter(lab => lab.city.trim() === search.trim())
    : LABS_DATA;

  // بطاقة المختبر
  const renderLabCard = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.labName}>{item.name}</Text>
      <Text style={styles.labInfo}>الموقع: {item.location}</Text>
      <Text style={styles.labInfo}>رقم التواصل: {item.phone}</Text>
      <Text style={styles.labCity}>({item.city})</Text>
    </View>
  );

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top","bottom"]}>
      <View style={styles.container}>

        <TextInput
          style={styles.input}
          placeholder="ابحث باسم المدينة..."
          value={search}
          onChangeText={setSearch}
        />
        <FlatList
          data={filteredLabs}
          keyExtractor={item => item.id}
          renderItem={renderLabCard}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={<Text style={styles.emptyText}>لا يوجد مختبرات مطابقة</Text>}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f6f8fa',
  },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00b29c', // نفس الأزرق المستخدم في باقي الشاشات
    marginBottom: 16,
    textAlign: 'center',
    alignSelf: 'center',
    flex: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  listContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  labName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00b29c', // أزرق مثل العناوين
    marginBottom: 4,
  },
  labInfo: {
    fontSize: 15,
    color: '#222', // أسود واضح
    marginBottom: 2,
  },
  labCity: {
    fontSize: 14,
    color: '#00b29c',
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 30,
    fontSize: 16,
  },
});

export default LabsScreen;
