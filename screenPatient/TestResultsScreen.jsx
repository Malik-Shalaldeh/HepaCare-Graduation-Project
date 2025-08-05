import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';


const primary = '#00b29c';

const patientResults = [
  {
    id: '3',
    patientId: '1001',
    name: 'أحمد خالد',
    test: 'تحليل بيليروبين',
    result: '1.2 mg/dL',
    evaluation: 'طبيعي',
    doctorNote: 'نتائج ممتازة.',
    dat: '15/10/2025',
  },
  {
    id: '1',
    patientId: '1001',
    name: 'أحمد خالد',
    test: 'تحليل كبد ALT',
    result: '45 U/L',
    evaluation: 'مرتفع قليلاً',
    doctorNote: 'ينصح بإعادة الفحص بعد أسبوع وتقليل الدهون.',
    dat: '3/8/2015',
  },
];

const TestResultsScreen = () => {
  
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>👤 {item.name} (رقم: {item.patientId})</Text>
      <Text style={styles.test}>🧪 الفحص: {item.test}</Text>
      <Text style={styles.result}>📊 النتيجة: {item.result}</Text>
      <Text style={styles.evaluation}>📈 التقييم: {item.evaluation}</Text>
      <Text style={styles.note}>💬 ملاحظة الطبيب: {item.doctorNote}</Text>
      <Text style={styles.note}>📅 تاريخ الفحص: {item.dat}</Text>
    </View>
  );

  return (
    <ScreenWithDrawer>
      <View style={styles.container}>
        <Text style={styles.header}>🧾 فحوصاتي</Text>
        <FlatList
          data={patientResults}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              لا توجد فحوصات متاحة لهذا المريض.
            </Text>
          }
        />
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2C3E50',
    textAlign: 'right',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    borderLeftColor: primary,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#34495E',
    textAlign: 'right',
  },
  test: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'right',
  },
  result: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'right',
  },
  evaluation: {
    fontSize: 16,
    color: '#27ae60',
    marginBottom: 4,
    textAlign: 'right',
  },
  note: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'right',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});

export default TestResultsScreen;
