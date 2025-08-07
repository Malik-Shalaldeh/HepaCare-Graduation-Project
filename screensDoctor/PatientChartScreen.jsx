import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';

const TESTS = [
  { key: 'ALT',       label: 'ALT (U/L)' },
  { key: 'AST',       label: 'AST (U/L)' },
  { key: 'Bilirubin', label: 'Bilirubin (mg/dL)' },
  { key: 'INR',       label: 'INR' },
  { key: 'Platelets', label: 'Platelets (#/μL)' },
  { key: 'FIB4',      label: 'Fibrosis-4' },
  { key: 'APRI',      label: 'APRI' },
];

// مثال بيانات (استبدلها بجلب حقيقي)
const DATA = {
  '1': [
    { date:'2025-06-01', ALT:42, AST:38, Bilirubin:1.0, INR:1.0, Platelets:180, FIB4:1.0, APRI:0.5 },
    { date:'2025-07-01', ALT:50, AST:45, Bilirubin:1.2, INR:1.1, Platelets:160, FIB4:1.2, APRI:0.6 },
    { date:'2025-08-01', ALT:55, AST:50, Bilirubin:1.3, INR:1.2, Platelets:150, FIB4:1.5, APRI:0.7 },
  ],
};

const COLORS = ['#D32F2F','#1976D2','#388E3C','#FBC02D','#7B1FA2','#00796B','#F57C00'];
const { width } = Dimensions.get('window');

export default function PatientChartScreen() 
{
  const { patientId, patientName } = useRoute().params;
  const navigation = useNavigation();
  const [records, setRecords] = useState(null);

  useEffect(() => {
    setRecords(DATA[patientId] || []);
  }, [patientId]);

  if (records === null) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS[0]} />
      </SafeAreaView>
    );
  }

  // إعداد بيانات الرسم
  const labels = records.map(r => r.date);

  const datasets = TESTS.map((t, i) => ({
    data: records.map(r => r[t.key] || 0),
    color: () => COLORS[i % COLORS.length],
    strokeWidth: 2,
  }));

 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <TouchableOpacity
        onPress={() => navigation.navigate('PatientListScreen')}
        style={styles.backBtn}
      >
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.pageTitle}>تطور حالة المريض</Text>
      <Text style={styles.patientInfo}>{patientName} ({patientId})</Text>

      <View style={styles.legend}>
        {TESTS.map((t, i) => (
          <View key={t.key} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS[i % COLORS.length] }]} />
            <Text style={styles.legendLabel}>{t.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.chartWrapper}>
        {records.length > 0 ? (
          <LineChart
            data={{ labels, datasets }}
            width={width - 40}
            height={280}
            fromZero
            withDots
            bezier
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 1,
              color: (opacity = 1) => `rgba(0,150,136,${opacity})`,
              labelColor: (opacity = 1) => `rgba(0,0,0,${opacity})`,
              style: { borderRadius: 12 },
              propsForDots: { r: '4', strokeWidth: '2', stroke: '#009688' },
            }}
            style={styles.chart}
          />
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>لا توجد بيانات لعرضها</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  backBtn: {
    margin: 10,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00796B',
    textAlign: 'center',
    marginTop: 4,
  },
  patientInfo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 12,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 8,
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: 12,
    color: '#333',
  },
  chartWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  chart: {
    borderRadius: 12,
  },
  emptyChart: {
    width: width - 40,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
