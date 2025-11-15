import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import ENDPOINTS from '../malikEndPoint';
import axios from 'axios';

// استدعاء الثيم الموحد
import theme from '../style/theme';

const Dashboard = () => {
  const navigation = useNavigation();
  const [doctorName, setDoctorName] = useState('');
  const [patientsCount, setPatientsCount] = useState(0);

  const today = new Date();
  const months = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];
  const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  useEffect(() => {
    let active = true;

    const fetchDashboard = async () => {
      try {
        const doctor_id = await AsyncStorage.getItem('doctor_id');
        if (!doctor_id) {
          Alert.alert('خطأ', 'لم يتم العثور على رقم الطبيب، يرجى تسجيل الدخول مجددًا.');
          return;
        }
        const res = await axios.get(ENDPOINTS.DOCTOR_DASHBOARD.GET, {
          params: { doctor_id },
        });

        if (!active) return;

        const data = res.data || {};

        setDoctorName(data.doctor_name || '');
        setPatientsCount(Number(data.patients_count) || 0);
      } catch (err) {
        console.log('Dashboard error:', err?.message || err);
        if (active) {
          Alert.alert('خطأ', 'تعذر جلب بيانات لوحة التحكم.');
          navigation.navigate('LoginScreen');
        }
      }
    };

    fetchDashboard();
    const unsubscribe = navigation.addListener('focus', fetchDashboard);

    return () => {
      active = false;
      if (unsubscribe) unsubscribe();
    };
  }, [navigation]);

  return (
    <ScreenWithDrawer title="لوحة التحكم">
      {/* هيدر الشاشة */}
      <View
        style={styles.header}
        accessible
        accessibilityRole="header"
        accessibilityLabel="رأس صفحة لوحة التحكم، تطبيق هيباكير"
        accessibilityHint="يعرض اسم نظام HepaCare في أعلى الشاشة"
        accessibilityLanguage="ar"
      >
        <Text
          style={styles.headerText}
          accessibilityRole="text"
          accessibilityLabel="هيباكير"
          accessibilityLanguage="ar"
        >
          Hepacare
        </Text>
      </View>

      {/* المحتوى الرئيسي */}
      <View style={styles.container} accessibilityLanguage="ar">
        {/* كرت الترحيب بالطبيب */}
        <View
          style={styles.card}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`مرحباً دكتور ${doctorName || 'غير معروف'}، تاريخ اليوم ${formattedDate}`}
          accessibilityHint="يعرض اسم الطبيب والتاريخ الحالي"
          accessibilityLanguage="ar"
        >
          <Ionicons
            name="person-circle-outline"
            size={40}
            color={theme.colors.accent}
            style={styles.icon}
            accessibilityLabel="أيقونة طبيب"
            accessibilityRole="image"
            accessibilityLanguage="ar"
          />
          <View>
            <Text style={styles.title}>
              مرحباً د.{doctorName ? doctorName : '...'} 👨‍⚕️
            </Text>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
        </View>

        {/* كرت عدد المرضى */}
        <View
          style={styles.card}
          accessible
          accessibilityRole="text"
          accessibilityLabel={`${patientsCount} مريض تحت إشرافك`}
          accessibilityHint="يعرض العدد الكلي للمرضى الذين تشرف عليهم حالياً"
          accessibilityLanguage="ar"
        >
          <Ionicons
            name="people-outline"
            size={40}
            color={theme.colors.accent}
            style={styles.icon}
            accessibilityLabel="أيقونة مجموعة مرضى"
            accessibilityRole="image"
            accessibilityLanguage="ar"
          />
          <View>
            <Text style={styles.title}>{patientsCount} مريض</Text>
            <Text style={styles.subtitle}>عدد المرضى المشرف عليهم</Text>
          </View>
        </View>

        {/* زر الانتقال لشاشة نظرة عامة */}
        <TouchableOpacity
          style={styles.overviewButton}
          onPress={() => navigation.navigate('نظرة عامة')}
          activeOpacity={0.85}
          accessible
          accessibilityRole="button"
          accessibilityLabel="فتح شاشة النظرة العامة على المرضى"
          accessibilityHint="ينقلك إلى شاشة تعرض توزيع المرضى حسب المحافظة"
          accessibilityLanguage="ar"
        >
          <View style={styles.overviewIconWrapper}>
            <Ionicons
              name="stats-chart-outline"
              size={22}
              color={theme.colors.primary}
              accessibilityLabel="أيقونة إحصائيات"
              accessibilityRole="image"
              accessibilityLanguage="ar"
            />
          </View>

          <View style={styles.overviewTextWrapper}>
            <Text style={styles.overviewTitle}>نظرة عامة</Text>
            <Text style={styles.overviewSubtitle}>
              عرض توزيع المرضى حسب المحافظة
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xxl,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  icon: {
    marginEnd: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.headingSm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  subtitle: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  header: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  headerText: {
    fontSize: theme.typography.headingLg,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    fontFamily: theme.typography.fontFamily,
  },
  overviewButton: {
    width: '100%',
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  overviewIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: theme.spacing.sm,
  },
  overviewTextWrapper: {
    flex: 1,
  },
  overviewTitle: {
    color: '#FFFFFF',
    fontSize: theme.typography.bodyLg,
    fontWeight: '700',
    marginBottom: 2,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  overviewSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: theme.typography.bodySm,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
});

export default Dashboard;
