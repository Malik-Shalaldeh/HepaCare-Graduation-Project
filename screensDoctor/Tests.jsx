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
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color={theme.colors.textPrimary}
        />
        <Text
          style={styles.backText}
        >
          رجوع
        </Text>
      </TouchableOpacity>

      {/* زر إدخال نتائج الفحوصات (أساسي) */}
      <TouchableOpacity
        style={[styles.testButton, styles.entryButton]}
        onPress={() => navigation.navigate('InputTestResultScreen')}
        activeOpacity={0.9}
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="create-outline"
            size={24}
            color={theme.colors.buttonPrimaryText}
            style={styles.icon}
          />
          <Text
            style={[styles.testButtonText, styles.testButtonTextOnPrimary]}
          >
            ادخال نتائج الفحوصات
          </Text>
        </View>
      </TouchableOpacity>

      {/* زر نتائج الفحوصات */}
      <TouchableOpacity
        style={[styles.testButton, styles.resultsButton]}
        onPress={() => navigation.navigate('TestResultsScreen')}
        activeOpacity={0.9}
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="document-text-outline"
            size={24}
            color={theme.colors.buttonSecondaryText}
            style={styles.icon}
          />
          <Text
            style={[styles.testButtonText, styles.testButtonTextOnSecondary]}
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
      >
        <View style={styles.testButtonContent}>
          <Ionicons
            name="medkit-outline"
            size={24}
            color={theme.colors.buttonInfoText}
            style={styles.icon}
          />
          <Text
            style={[styles.testButtonText, styles.testButtonTextOnInfo]}
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
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  // توزيع الألوان حسب الثيم
  entryButton: {
    backgroundColor: theme.colors.buttonPrimary,   // أهم زر
  },
  resultsButton: {
    backgroundColor: theme.colors.buttonSecondary, // ثانوي
  },
  indicatorsButton: {
    backgroundColor: theme.colors.buttonInfo,      // معلومات/حسابات
  },
  testButtonContent: {
    flexDirection: 'row-reverse', // لأن النص بالعربي
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testButtonText: {
    fontSize: theme.typography.headingSm,
    fontWeight: 'bold',
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
    flex: 1,
  },
  testButtonTextOnPrimary: {
    color: theme.colors.buttonPrimaryText,
  },
  testButtonTextOnSecondary: {
    color: theme.colors.buttonSecondaryText,
  },
  testButtonTextOnInfo: {
    color: theme.colors.buttonInfoText,
  },
  icon: {
    marginLeft: theme.spacing.sm,
  },
});

export default Tests;
