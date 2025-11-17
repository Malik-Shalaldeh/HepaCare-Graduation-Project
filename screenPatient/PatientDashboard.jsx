// screensPatient/PatientDashboard.jsx
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

export default function PatientDashboard() {
  const [name, setName] = useState('');

  useEffect(() => {
    const loadName = async () => {
      const id = await AsyncStorage.getItem('user_id');
      if (!id) return;
      try {
        const res = await axios.get(ENDPOINTS.PATIENT_DASHBOARD.BY_ID(id));
        setName(res.data.full_name);
      } catch (error) {
        console.log('خطأ في جلب البيانات', error?.message);
      }
    };
    loadName();
  }, []);

  const today = new Date();
  const months = [
    'يناير','فبراير','مارس','أبريل','مايو','يونيو',
    'يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'
  ];
  const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <ScreenWithDrawer title="لوحة التحكم" showDrawerIcon>
      <View
        style={styles.screen}
      >
        {/* الهيدر */}
        <View
          style={styles.header}
        >
          <Text
            style={styles.headerText}
          >
            HepaCare
          </Text>
        </View>

        <View style={styles.container}>
          {/* بطاقة الترحيب */}
          <View
            style={styles.card}
          >
            <Ionicons
              name="happy-outline"
              size={40}
              color={theme.colors.buttonInfo}
              style={styles.icon}
            />
            <View>
              <Text
                style={styles.title}
              >
                {name || 'مستخدم'}
              </Text>
              <Text
                style={styles.subtitle}
              >
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* صندوق التشجيع */}
          <View
            style={styles.motivationBox}
          >
            <Ionicons
              name="heart-circle-outline"
              size={50}
              color={theme.colors.danger}
              style={{ marginBottom: theme.spacing.sm }}
            />
            <Text
              style={styles.motivationText}
            >
              صحتك أمانة... تابع أدويتك وفحوصاتك بانتظام لتحمي كبدك ونحافظ على عافيتك
            </Text>
          </View>
        </View>
      </View>
    </ScreenWithDrawer>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    width: '100%',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  headerText: {
    fontSize: theme.typography.headingLg,
    fontWeight: 'bold',
    color: theme.colors.buttonPrimaryText,
    letterSpacing: 2,
    fontFamily: theme.typography.fontFamily,
  },
  container: {
    flex: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    flexDirection: 'row-reverse', // عشان الاسم يكون قريب من الأيقونة بالعربي
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  icon: {
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.headingSm,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },
  subtitle: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },
  motivationBox: {
    width: '100%',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    ...theme.shadows.light,
  },
  motivationText: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    textAlign: 'center',
    lineHeight: theme.typography.lineHeightNormal,
    fontFamily: theme.typography.fontFamily,
  },
});
