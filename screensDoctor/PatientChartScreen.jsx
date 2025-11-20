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
  Alert,
  ScrollView, 
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

const TESTS = [
  { key: 'ALT',       label: 'ALT (U/L)' },
  { key: 'AST',       label: 'AST (U/L)' },
  { key: 'Bilirubin', label: 'Bilirubin (mg/dL)' },
  { key: 'INR',       label: 'INR' },
  { key: 'Platelets', label: 'Platelets (#/μL)' },
  { key: 'FIB4',      label: 'Fibrosis-4' },
  { key: 'APRI',      label: 'APRI' },
];

const COLORS = [
  '#1E88E5', 
  '#43A047', 
  '#FB8C00', 
  '#8E24AA', 
  '#00ACC1', 
  '#F4511E', 
  '#3949AB', 
];

const { width } = Dimensions.get('window');

export default function PatientChartScreen() {
  const route = useRoute();
  const patientId = route.params.patientId;
  const patientName = route.params.patientName;
  const [records, setRecords] = useState(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await axios.get(
          `${ENDPOINTS.PATIENT_CHART.GET}?patient_id=${patientId}`
        );
        setRecords(response.data);
      } 
      catch (error) {
        Alert.alert(
          'خطأ',
          'تأكد من اتصالك بالإنترنت',
          [{ text: 'إلغاء', style: 'cancel' }]
        );
      }
    }

    loadData();
  }, [patientId]);

  if (records === null) {
    return (
      <SafeAreaView style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>
          جارِ تحميل البيانات...
        </Text>
      </SafeAreaView>
    );
  }

  const labels = records.map(r => r.date);

  const datasets = TESTS.map((t, i) => ({
    data: records.map(r => r[t.key] || 0),
    color: () => COLORS[i % COLORS.length],
    strokeWidth: 2,
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />

      {/* معلومات المريض */}
      <Text style={styles.patientInfo}>
        {patientName} ({patientId})
      </Text>

      {/*  (Legend) */}
      <View style={styles.legend}>
        {TESTS.map((t, i) => (
          <View key={t.key} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: COLORS[i % COLORS.length] },
              ]}
            />
            <Text style={styles.legendLabel}>{t.label}</Text>
          </View>
        ))}
      </View>

      {/* المخطط مع Scroll أفقي */}
      <View style={styles.chartWrapper}>
        {records.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
          >
            <LineChart
              data={{ labels, datasets }}
              width={labels.length * 80}
              height={400}
              fromZero
              withDots
              bezier
              chartConfig={{
                backgroundColor: theme.colors.background,
                backgroundGradientFrom: theme.colors.background,
                backgroundGradientTo: theme.colors.background,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(11, 70, 108, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(13, 30, 46, ${opacity})`,
                style: { borderRadius: theme.radii.md },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: theme.colors.accent,
                },
                propsForLabels: {
                  fontSize: 10,
                },
              }}
              style={styles.chart}
            />
          </ScrollView>
        ) : (
          <View style={styles.emptyChart}>
            <Text style={styles.emptyText}>
              لا توجد بيانات لعرضها
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.sm,
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  },
  patientInfo: {
    fontSize: theme.typography.bodyLg,
    textAlign: 'center',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 4,
  },
  legendLabel: {
    fontSize: theme.typography.bodySm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  chartWrapper: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  chart: {
    borderRadius: theme.radii.md,
  },
  emptyChart: {
    width: width - 20,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
  },
  emptyText: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textMuted,
    fontFamily: theme.typography.fontFamily,
  },
});
