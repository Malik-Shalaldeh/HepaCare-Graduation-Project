// screensDoctor/Medications.jsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import theme from '../style/theme';

export default function Medications() {
  const navigation = useNavigation();

  return (
    <View
      style={styles.container}
      accessibilityLanguage="ar"
    >
      {/* شريط الحالة */}
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      {/* الهيدر */}
      <View
        style={styles.header}
        accessible
        accessibilityRole="header"
        accessibilityLabel="شاشة إدارة الأدوية"
        accessibilityHint="تعرض خيارات لجدولة الأدوية للمرضى أو عرض أدوية وزارة الصحة"
        accessibilityLanguage="ar"
      >
        {/* زر القائمة الجانبية */}
        <TouchableOpacity
          onPress={() => navigation.toggleDrawer()}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="فتح قائمة التنقل الجانبية"
          accessibilityHint="يفتح القائمة الجانبية للتنقل بين شاشات الطبيب"
          accessibilityLanguage="ar"
        >
          <Ionicons
            name="menu"
            size={28}
            color={theme.colors.buttonPrimaryText}
            accessibilityRole="image"
            accessibilityLabel="أيقونة قائمة"
            accessibilityLanguage="ar"
          />
        </TouchableOpacity>

        {/* عنوان الهيدر */}
        <Text
          style={styles.headerTitle}
          accessibilityRole="text"
          accessibilityLabel="الأدوية"
          accessibilityLanguage="ar"
        >
          الأدوية
        </Text>

        {/* عنصر فارغ للموازنة البصرية */}
        <View style={{ width: 28 }} />
      </View>

      {/* المحتوى */}
      <View style={styles.content}>
        {/* زر جدولة دواء لمريض */}
        <TouchableOpacity
          style={[styles.button, styles.scheduleButton]}
          onPress={() => navigation.navigate('MedPatientsScreen')}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="جدولة دواء لمريض"
          accessibilityHint="يفتح شاشة لاختيار مريض وتحديد دواء ووقت تناوله"
          accessibilityLanguage="ar"
        >
          <Ionicons
            name="calendar-outline"
            size={24}
            color={theme.colors.buttonPrimaryText}
            style={styles.icon}
            accessibilityRole="image"
            accessibilityLabel="أيقونة تقويم لجدولة الدواء"
            accessibilityLanguage="ar"
          />
          <Text
            style={[styles.buttonText, styles.buttonTextPrimary]}
            accessibilityRole="text"
            accessibilityLanguage="ar"
          >
            جدولة دواء لمريض
          </Text>
        </TouchableOpacity>

        {/* زر عرض أدوية الصحة */}
        <TouchableOpacity
          style={[styles.button, styles.healthMedsButton]}
          onPress={() => navigation.navigate('HealthMedicationsDisplay')}
          activeOpacity={0.8}
          accessible
          accessibilityRole="button"
          accessibilityLabel="عرض أدوية وزارة الصحة"
          accessibilityHint="يفتح شاشة لعرض قائمة الأدوية المتوفرة في وزارة الصحة"
          accessibilityLanguage="ar"
        >
          <Ionicons
            name="medkit-outline"
            size={24}
            color={theme.colors.buttonInfoText}
            style={styles.icon}
            accessibilityRole="image"
            accessibilityLabel="أيقونة حقيبة أدوية"
            accessibilityLanguage="ar"
          />
          <Text
            style={[styles.buttonText, styles.buttonTextInfo]}
            accessibilityRole="text"
            accessibilityLanguage="ar"
          >
            عرض أدوية الصحة
          </Text>
        </TouchableOpacity>

        {/* تقدر تضيف أزرار أخرى بنفس النمط لاحقاً */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    paddingBottom: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    ...theme.shadows.medium,
  },
  headerTitle: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.headingMd,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.lg,
  },
  button: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radii.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  // ألوان الأزرار من الثيم (كلها باردة وقريبة من الأساسي)
  scheduleButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  healthMedsButton: {
    backgroundColor: theme.colors.buttonInfo,
  },
  buttonText: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '600',
    marginRight: theme.spacing.sm,
    fontFamily: theme.typography.fontFamily,
  },
  buttonTextPrimary: {
    color: theme.colors.buttonPrimaryText,
  },
  buttonTextInfo: {
    color: theme.colors.buttonInfoText,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});
