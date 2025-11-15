import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import theme from '../style/theme';

const Tests = () => {
  const navigation = useNavigation();

  return (
    <ScreenWithDrawer title={'الفحوصات'}>
      {/* زر الرجوع */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        accessible
        accessibilityRole="button"
        accessibilityLabel="رجوع"
        accessibilityHint="العودة إلى الشاشة السابقة"
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
        <Text
          style={styles.backText}
          accessibilityRole="text"
          accessibilityLanguage="ar"
        >
          رجوع
        </Text>
      </TouchableOpacity>

      {/* زر إدخال نتائج الفحوصات */}
      <TouchableOpacity
        style={[styles.testButton, styles.entryButton]}
        onPress={() => navigation.navigate('InputTestResultScreen')}
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityLabel="إدخال نتائج الفحوصات"
        accessibilityHint="يفتح شاشة لإدخال نتائج الفحوصات للمرضى"
        accessibilityLanguage="ar"
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="create-outline"
            size={24}
            color={theme.colors.background}
            style={styles.icon}
            accessibilityRole="image"
            accessibilityLabel="أيقونة إدخال"
            accessibilityLanguage="ar"
          />
          <Text
            style={styles.testButtonText}
            accessibilityRole="text"
            accessibilityLanguage="ar"
          >
            ادخال نتائج الفحوصات
          </Text>
        </View>
      </TouchableOpacity>

      {/* زر نتائج الفحوصات */}
      <TouchableOpacity
        style={styles.testButton}
        onPress={() => navigation.navigate('TestResultsScreen')}
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityLabel="نتائج فحوصات المرضى"
        accessibilityHint="يفتح شاشة لمشاهدة نتائج الفحوصات المخزنة للمرضى"
        accessibilityLanguage="ar"
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={theme.colors.background}
            style={styles.icon}
            accessibilityRole="image"
            accessibilityLabel="أيقونة ملف نتائج"
            accessibilityLanguage="ar"
          />
          <Text
            style={styles.testButtonText}
            accessibilityRole="text"
            accessibilityLanguage="ar"
          >
            نتائج فحوصات المرضى
          </Text>
        </View>
      </TouchableOpacity>

      {/* زر حساب القيم الطبية */}
      <TouchableOpacity
        style={[styles.testButton, styles.indicatorsButton]}
        onPress={() => navigation.navigate('MedicalIndicatorsScreen')}
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityLabel="حساب القيم الطبية"
        accessibilityHint="يفتح شاشة لحساب المؤشرات والقيم الطبية بناءً على مدخلاتك"
        accessibilityLanguage="ar"
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="medkit-outline"
            size={24}
            color={theme.colors.background}
            style={styles.icon}
            accessibilityRole="image"
            accessibilityLabel="أيقونة حقيبة طبية"
            accessibilityLanguage="ar"
          />
          <Text
            style={styles.testButtonText}
            accessibilityRole="text"
            accessibilityLanguage="ar"
          >
            حساب القيم الطبية
          </Text>
        </View>
      </TouchableOpacity>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  backText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  testButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  entryButton: {
    backgroundColor: theme.colors.success, // مميز للإدخال
  },
  indicatorsButton: {
    backgroundColor: theme.colors.accent, // لون مختلف لزر القيم الطبية
  },
  testButtonContent: {
    flexDirection: 'row-reverse', // لأن النص بالعربي
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.headingSm,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
    flex: 1,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});

export default Tests;
