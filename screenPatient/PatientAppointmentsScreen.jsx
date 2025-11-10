// sami
import React, { useState, useEffect, useCallback } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENDPOINTS from '../samiendpoint';

const PatientAppointmentsScreen = () => {
  const [appointments, setAppointments] = useState([]);
  const [clinicName, setClinicName] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const getStoredPatientId = useCallback(async () => {
    const keys = ['patient_id', 'patientId', 'user_id', 'userId', 'id'];
    for (const key of keys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        return value;
      }
    }
    return null;
  }, []);

  const normalizeAppointment = (row) => {
    const rawStart = row.start_at || '';
    const startDate = rawStart ? new Date(rawStart.replace(' ', 'T')) : null;
    return {
      id: String(row.id),
      date: startDate ? startDate.toLocaleDateString() : 'غير محدد',
      time: startDate ? startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
      doctor: row.doctor_name || `دكتور رقم ${row.doctor_id}`,
      clinic: row.clinic_name || '',
      notes: row.notes || '',
    };
  };

  const loadAppointments = useCallback(async () => {
    setRefreshing(true);
    try {
      setError('');
      let patientId = await getStoredPatientId();
      if (!patientId) {
        setAppointments([]);
        setClinicName('');
        setError('لم يتم العثور على رقم المريض.');
        return;
      }

      const url = ENDPOINTS.patientAppointmentsByPatient(patientId);
      const response = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!response.ok) {
        throw new Error('تعذر جلب المواعيد');
      }
      const data = await response.json();
      const rows = Array.isArray(data) ? data : data.appointments || [];
      const normalized = rows.map(normalizeAppointment);
      setAppointments(normalized);
      setClinicName(normalized[0]?.clinic || '');
    } catch (err) {
      setError(err.message || 'حدث خطأ أثناء تحميل المواعيد');
      setAppointments([]);
      setClinicName('');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [getStoredPatientId]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await loadAppointments();
    };
    init();
  }, [loadAppointments]);

  const onRefresh = () => {
    loadAppointments();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={22} color="#00b29c" style={{ marginEnd: 10 }} />
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.doctor}>{item.doctor}</Text>
      {!!item.notes && <Text style={styles.notes}>{item.notes}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <View style={styles.container}>
        <Text style={styles.clinicName}>{clinicName || 'مواعيدي'}</Text>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {loading && !appointments.length ? (
          <ActivityIndicator color="#00b29c" style={{ marginTop: 24 }} />
        ) : (
          <FlatList
            data={appointments}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={appointments.length ? undefined : styles.emptyContainer}
            ListEmptyComponent={<Text style={styles.emptyText}>لا يوجد مواعيد حالياً</Text>}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00b29c" />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  clinicName: {
    fontSize: 17,
    color: '#00b29c',
    fontWeight: 'bold',
    marginBottom: 18,
    alignSelf: 'center',
  },
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  date: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginEnd: 12,
  },
  time: {
    fontSize: 15,
    color: '#00b29c',
    fontWeight: 'bold',
  },
  doctor: {
    fontSize: 15,
    color: '#333',
    marginBottom: 2,
  },
  notes: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 30,
    fontSize: 16,
  },
  error: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
});

export default PatientAppointmentsScreen;
