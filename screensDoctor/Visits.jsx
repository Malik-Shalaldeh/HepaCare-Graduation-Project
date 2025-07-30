// By sami: شاشة الزيارات الأصلية مع زر إضافي لسجل الزيارات
// By sami: واجهة الزيارات الجديدة – تبدأ بالبحث ثم تظهر الخيارات
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput, SafeAreaView } from 'react-native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const primary = '#00b29c';

// بيانات المرضى (يُستحسن لاحقاً جلبها من نفس المصدر المركزي)
const patientsData = [
  { id: '1', name: 'مالك شلالدة' },
  { id: '2', name: 'عبد الجندي' },
  { id: '3', name: 'محمود علي' },
  { id: '4', name: 'فاطمة أحمد' },
  { id: '5', name: 'خالد عمر' },
  { id: '6', name: 'ريم الخطيب' },
  { id: '7', name: 'عمر حسن' },
  { id: '8', name: 'ليلى كريم' },
];

const Visits = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  // ترشيح المرضى بناءً على البحث
  const filteredPatients = patientsData.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.id.includes(searchText)
  );


  return (
    <ScreenWithDrawer title="الزيارات">
      <SafeAreaView style={{ flex:1 }}>
        {/* حقل البحث */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="ابحث عن المريض..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        </View>

        {/* قائمة المرضى */}
        {!selectedPatient && (
          <FlatList
            data={filteredPatients}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => setSelectedPatient(item)}
              >
                <Text style={styles.resultText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              searchText.trim().length > 0 && filteredPatients.length === 0 ? (
                <Text style={styles.noResults}>لا يوجد نتائج مطابقة.</Text>
              ) : null
            }
            contentContainerStyle={{ paddingBottom: 10 }}
          />
        )}

        {/* الأزرار بعد اختيار المريض */}
        {selectedPatient && (
          <View style={{ marginTop: 20 }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('تقييم الزيارة', {
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
              })}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="document-text-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>تقييم زيارة المريض</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('سجل الزيارات', {
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
              })}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="calendar-outline" size={24} color="#fff" style={styles.icon} />
                <Text style={styles.buttonText}>عرض سجل الزيارات</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  // حقل البحث
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: 14,
  },
  searchIcon: {
    marginLeft: 6,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  resultText: { textAlign:'right', fontSize: 16 },
  noResults: { textAlign:'center', marginTop: 20, color:'#666' },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Visits;
