//sami

// PatientListScreen.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENDPOINTS from '../samiendpoint';


const PatientListScreen = () => {
  const navigation = useNavigation();

  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);


  useEffect(() => {
    const loadPatients = async () => {
      try {
        // جلب معرف الطبيب من AsyncStorage
        const doctorId = await AsyncStorage.getItem('doctor_id');
        
        if (!doctorId) {
          Alert.alert('خطأ', 'يرجى تسجيل الدخول مرة أخرى');
          return;
        }

        // استدعاء الـ API باستخدام fetch
        const url = `${ENDPOINTS.patientsList}?doctor_id=${doctorId}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch patients');
        }

        const patientsData = await response.json();
        
        setPatients(patientsData || []);
        setFilteredPatients(patientsData || []);
      } catch (error) {
        console.error('خطأ في جلب المرضى:', error);
        Alert.alert('خطأ', 'تعذر جلب قائمة المرضى');
      }
    };

    loadPatients();
  }, []);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filtered = text.trim() === ''
      ? patients
      : patients.filter(patient =>
          patient.name.toLowerCase().includes(text.toLowerCase()) ||
          patient.nationalId.includes(text)
        );
    setFilteredPatients(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    return new Date(dateString).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderPatientItem = ({ item }) => (
    <View style={styles.patientCard}>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.name}</Text>
        <View style={styles.patientDetails}>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{item.nationalId}</Text>
            <Text style={styles.detailLabel}>رقم الهوية:</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{item.age} سنة</Text>
            <Text style={styles.detailLabel}>العمر:</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{formatDate(item.lastVisit)}</Text>
            <Text style={styles.detailLabel}>آخر زيارة:</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{item.symptoms}</Text>
            <Text style={styles.detailLabel}>الأعراض:</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailValue}>{item.medications}</Text>
            <Text style={styles.detailLabel}>الأدوية:</Text>
          </View>
          {item.phone && (
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{item.phone}</Text>
              <Text style={styles.detailLabel}>رقم الهاتف:</Text>
            </View>
          )}
          {item.address && (
            <View style={styles.detailItem}>
              <Text style={styles.detailValue}>{item.address}</Text>
              <Text style={styles.detailLabel}>العنوان:</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.medicalFileButton}
          onPress={() =>
            navigation.navigate('PatientChartScreen', {
              patientId: item.id,
              patientName: item.name
            })
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.medicalFileButtonText}>حالة المريض</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.visitHistoryButton}
          onPress={() =>
            navigation.navigate('سجل الزيارات', {
              patientId: item.id,
              patientName: item.name,
            })
          }
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.visitHistoryButtonText}>سجل الزيارات</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("PatientsStack")}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>قائمة المرضى</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="البحث بالاسم أو رقم الهوية"
            value={searchQuery}
            onChangeText={handleSearch}
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <FlatList
        data={filteredPatients}
        renderItem={renderPatientItem}
        keyExtractor={item => String(item.id)}
        contentContainerStyle={styles.patientList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>لا يوجد مرضى</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { flexDirection: 'row', alignItems: 'center', marginTop: 5, marginBottom: 5, marginLeft: 16 },
  header: {
    height: 60,
    backgroundColor: '#A8E6A1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: '100%', fontSize: 16, color: '#333', textAlign: 'right' },
  patientList: { padding: 16, paddingBottom: 80 },
  patientCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#eee',
  },
  patientInfo: { marginBottom: 12 },
  patientName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8, textAlign: 'right' },
  patientDetails: { marginBottom: 8 },
  detailItem: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 4 },
  detailLabel: { fontSize: 14, color: '#666', marginLeft: 4 },
  detailValue: { fontSize: 14, color: '#333', fontWeight: '500', marginLeft: 4 },
  cardActions: { flexDirection: 'row-reverse', alignItems: 'center', marginTop: 10 },
  medicalFileButton: {
    backgroundColor: '#A8E6A1',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicalFileButtonText: { color: '#333', fontWeight: 'bold', fontSize: 14 },
  visitHistoryButton: {
    backgroundColor: '#00b29c',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    marginRight: 8,
  },
  visitHistoryButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#A8E6A1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  formContainer: { padding: 15 },
  inputGroup: { marginBottom: 15 },
  inputLabel: { fontSize: 16, color: '#333', marginBottom: 5, textAlign: 'right' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlign: 'right',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#A8E6A1',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: '#333', fontWeight: 'bold', fontSize: 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  emptyText: {
    fontSize: 18,
    color: '#666'
  }
});

export default PatientListScreen;
