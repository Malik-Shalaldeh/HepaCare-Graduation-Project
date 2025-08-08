// sami 
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// بيانات تجريبية - مستقبلاً ستأتي من الباك اند
const MOCK_APPOINTMENTS = [
  { id: '1', date: '2025-08-10', time: '10:00', doctor: 'د. أحمد عوض', notes: 'متابعة شهرية' },
  { id: '2', date: '2025-08-18', time: '14:30', doctor: 'د. سامر أبو يوسف', notes: '' },
  { id: '3', date: '2025-09-01', time: '09:00', doctor: 'د. ليلى بركات', notes: 'تحاليل دم' },
]; // حالياً تجريبية، لاحقاً سنجلبها من السيرفر

const PatientAppointmentsScreen = () => {
  // في المستقبل سيتم جلب المواعيد من السيرفر
  const [appointments, setAppointments] = useState(MOCK_APPOINTMENTS);
  const [refreshing, setRefreshing] = useState(false);

  // دالة تحديث البيانات (مستقبلاً ستجلب من الباك اند)
  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // عند توفر الباك اند، استبدل الكود التالي:
      // const response = await axios.get(ENDPOINTS.patientAppointments);
      // setAppointments(response.data);
      setTimeout(() => setRefreshing(false), 800); // مؤقتاً فقط
    } catch (err) {
      // في حال حدوث خطأ في الشبكة
      setRefreshing(false);
    }
  };

  // في المستقبل عند تشغيل التطبيق، يمكن جلب المواعيد تلقائياً
  useEffect(() => {
    // عند توفر الباك اند استدعي onRefresh هنا
    // onRefresh();
  }, []);

  // بطاقة الموعد
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Ionicons name="calendar-outline" size={22} color="#00b29c" style={{marginEnd: 10}} />
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
      <Text style={styles.doctor}>{item.doctor}</Text>
      {!!item.notes && (
        <Text style={styles.notes}>{item.notes}</Text>
      )}
    </View>
  );

  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.safeArea} edges={["top","bottom"]}>
      <View style={styles.container}>

        <Text style={styles.clinicName}>عيادة السلام</Text> 
        <FlatList
          data={appointments}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={appointments.length ? undefined : styles.emptyContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>لا يوجد مواعيد حالياً</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
        {/* ملاحظة: عند الربط مع الباك اند، سنضيف هنا منطق جلب البيانات والتحديث التلقائي */}
        {/* ملاحظة: لدعم الإشعارات، يمكن إضافة useEffect هنا لاحقاً لربط خدمة التنبيهات */}
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
});

export default PatientAppointmentsScreen;
