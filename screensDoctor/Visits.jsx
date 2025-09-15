// By sami: شاشة الزيارات الأصلية مع زر إضافي لسجل الزيارات
// By sami: واجهة الزيارات الجديدة – تبدأ بالبحث ثم تظهر الخيارات
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const primary = '#00b29c';

const patientsData = [
  { id: '1', name: 'محمد عادل' },
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

  // تأكد أن selectedPatient يبدأ null عند دخول الشاشة
  useEffect(() => {
    setSelectedPatient(null);
  }, []);

  const filteredPatients = patientsData.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    p.id.includes(searchText)
  );

  return (
    <ScreenWithDrawer title="الزيارات">
      <SafeAreaView style={{ flex: 1 }}>
        {!selectedPatient ? (
          <>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن المريض..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            </View>

            {searchText.trim().length > 0 && (
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
                  filteredPatients.length === 0 ? (
                    <Text style={styles.noResults}>لا يوجد نتائج مطابقة.</Text>
                  ) : null
                }
                contentContainerStyle={{ paddingBottom: 10 }}
              />
            )}
          </>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedPatient(null)}
            >
              <Ionicons name="arrow-back" size={26} color={primary} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('تقييم الزيارة', {
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
              })}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="document-text-outline" size={24} color="#fff" />
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
                <Ionicons name="calendar-outline" size={24} color="#fff" />
                <Text style={styles.buttonText}>عرض سجل الزيارات</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

export default Visits;

const styles = StyleSheet.create({
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
  resultText: {
    textAlign: 'right',
    fontSize: 16,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  scrollContainer: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
