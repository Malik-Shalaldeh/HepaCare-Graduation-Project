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
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-chart-kit';
import axios from 'axios';
import HelpButton from '../componentHelp/ButtonHelp';
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

// ألوان مخصصة لخطوط المخطط والـ legend (مسموح تكون متنوعة)
const COLORS = ['#0B4F6C','#1876A6','#2FA4A9','#7B1FA2','#00796B','#3F8EDB','#145E80'];

const { width } = Dimensions.get('window');

export default function PatientChartScreen() {
  const route = useRoute();
  const navigation = useNavigation();

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
      } catch (error) {
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
      <SafeAreaView
        style={styles.loading}
        accessibilityLanguage="ar"
      >
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text
          style={styles.loadingText}
          accessible
          accessibilityRole="text"
          accessibilityLabel="جارِ تحميل بيانات المريض"
          accessibilityLanguage="ar"
        >
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
    <SafeAreaView
      style={styles.safeArea}
      accessibilityLanguage="ar"
    >
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.colors.background}
      />

      {/* زر الرجوع */}
      <TouchableOpacity
        onPress={() => navigation.navigate('PatientListScreen')}
        style={styles.backBtn}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
        accessibilityLabel="رجوع إلى قائمة المرضى"
        accessibilityHint="يعيدك إلى شاشة قائمة المرضى"
        accessibilityLanguage="ar"
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme.colors.textPrimary}
          accessibilityRole="image"
          accessibilityLabel="سهم الرجوع"
          accessibilityLanguage="ar"
        />
      </TouchableOpacity>

      {/* عنوان الصفحة */}
      <Text
        style={styles.pageTitle}
        accessible
        accessibilityRole="header"
        accessibilityLabel="تطور حالة المريض"
        accessibilityLanguage="ar"
      >
        تطور حالة المريض
      </Text>

      {/* معلومات المريض */}
      <Text
        style={styles.patientInfo}
        accessible
        accessibilityRole="text"
        accessibilityLabel={`اسم المريض ${patientName}، رقم المريض ${patientId}`}
        accessibilityLanguage="ar"
      >
        {patientName} ({patientId})
      </Text>

      {/* وسيلة الإيضاح (Legend) */}
      <View
        style={styles.legend}
        accessible
        accessibilityRole="text"
        accessibilityLabel="الألوان المستخدمة لكل فحص في المخطط"
        accessibilityLanguage="ar"
      >
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

      {/* المخطط */}
      <View
        style={styles.chartWrapper}
        accessible
        accessibilityRole="summary"
        accessibilityLabel="مخطط يوضح تغير نتائج الفحوصات مع الزمن"
        accessibilityHint="يمكنك النظر إلى اتجاه الخطوط لمعرفة تحسن أو تدهور حالة المريض"
        accessibilityLanguage="ar"
      >
        {records.length > 0 ? (
          <LineChart
            data={{ labels, datasets }}
            width={width - 40}
            height={280}
            fromZero
            withDots
            bezier
            chartConfig={{
              backgroundColor: theme.colors.background,
              backgroundGradientFrom: theme.colors.background,
              backgroundGradientTo: theme.colors.background,
              decimalPlaces: 1,
              color: (opacity = 1) =>
                `rgba(11, 79, 108, ${opacity})`, // قريب من primary
              labelColor: (opacity = 1) =>
                `rgba(13, 30, 46, ${opacity})`, // textPrimary
              style: { borderRadius: theme.radii.md },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: theme.colors.accent,
              },
            }}
            style={styles.chart}
          />
        ) : (
          <View style={styles.emptyChart}>
            <Text
              style={styles.emptyText}
              accessible
              accessibilityRole="text"
              accessibilityLabel="لا توجد بيانات لعرضها في المخطط"
              accessibilityLanguage="ar"
            >
              لا توجد بيانات لعرضها
            </Text>
          </View>
        )}
      </View>

      <HelpButton
        title="مساعدة - مخططات المريض"
        info="تعرض هذه الشاشة تطوّر نتائج الفحوصات للمريض على شكل مخطط زمني. استخدمها لمتابعة الاستجابة أو التدهور. الألوان توضّح كل فحص."
      />
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
  backBtn: {
    margin: theme.spacing.md,
  },
  pageTitle: {
    fontSize: theme.typography.headingMd,
    fontWeight: '700',
    color: theme.colors.primary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
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
    width: width - 40,
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
