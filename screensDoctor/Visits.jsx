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
  Platform,
  Alert
} from 'react-native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ENDPOINTS from '../samiendpoint';

const primary = '#00b29c';

const Visits = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب معرف الطبيب عند تحميل الشاشة
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const doctorId = await AsyncStorage.getItem('doctor_id');
        if (!doctorId) {
          Alert.alert('خطأ', 'يرجى تسجيل الدخول مرة أخرى');
          return;
        }
        
        // جلب المرضى
        await searchPatients(doctorId);
      } catch (error) {
        console.error('خطأ في جلب معرف الطبيب:', error);
        Alert.alert('خطأ', 'تعذر جلب بيانات الطبيب');
      }
    };

    fetchDoctorId();
  }, []);

  // البحث عن المرضى
  const searchPatients = async (doctorId, query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.searchPatients, {
        params: { 
          query: query,
          doctor_id: doctorId 
        }
      });
      
      setPatients(response.data || []);
    } catch (error) {
      console.error('خطأ في البحث عن المرضى:', error);
      Alert.alert('خطأ', 'تعذر جلب قائمة المرضى');
    } finally {
      setLoading(false);
    }
  };

  // تصفية المرضى محليًا
  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchText.toLowerCase()) ||
    String(p.id).includes(searchText)
  );

  // إعادة تعيين selectedPatient عند دخول الشاشة
  useEffect(() => {
    setSelectedPatient(null);
  }, []);

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
                onChangeText={async (text) => {
                  setSearchText(text);
                  const doctorId = await AsyncStorage.getItem('doctor_id');
                  if (doctorId) {
                    searchPatients(doctorId, text);
                  }
                }}
              />
              <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text>جار التحميل...</Text>
              </View>
            ) : (
              searchText.trim().length > 0 && (
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
              )
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

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('ملخص الزيارات', {
                patientId: selectedPatient.id,
                patientName: selectedPatient.name,
              })}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="logo-reddit" size={24} color="#fff" />
                <Text style={styles.buttonText}> ملخص الزيارات</Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Visits;
