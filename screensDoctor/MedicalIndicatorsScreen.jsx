// MedicalIndicatorsScreen.jsx
import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { AVAILABLE_TESTS } from '../componentDoctor/availableTestsindicators';
import TestCard from '../componentDoctor/TestCardindicator';
import ResultCard from '../componentDoctor/ResultCardincedators';
import {
  getInitialValuesForTest,
  analyzeTests,
  removeResultByKey,
} from '../componentDoctor/FunctionsMedicalIndicators';

import theme from '../style/theme';

const MedicalIndicatorsScreen = () => {
  const navigation = useNavigation();

  const [tests, setTests] = useState([]);
  const [values, setValues] = useState({});
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const selectTest = (key) => {
    if (!tests.includes(key)) {
      setTests(prev => [...prev, key]);

      const initial = getInitialValuesForTest(key);
      setValues(prev => ({ ...prev, ...initial }));

      setResults([]);
      setShowDropdown(false);
    }
  };

  const removeTest = (key) => {
    setTests(prev => prev.filter(t => t !== key));
    setResults(prev => removeResultByKey(prev, key));
  };

  const updateValue = (key, textvalue) => {
    setValues(prev => ({ ...prev, [key]: textvalue }));
  };

  const analyze = () => {
    const newResults = analyzeTests(tests, values);
    setResults(newResults);
  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      accessibilityLanguage="ar"
    >
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
      />

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

      {/* اختيار الفحص (dropdown) */}
      <View
        style={styles.dropdownContainer}
        accessible
        accessibilityRole="text"
        accessibilityLabel="اختر الفحص الذي تريد حساب قيمه"
        accessibilityLanguage="ar"
      >
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={toggleDropdown}
          activeOpacity={0.85}
          accessible
          accessibilityRole="button"
          accessibilityLabel="اختيار الفحص"
          accessibilityHint="اضغط لعرض قائمة الفحوصات المتاحة"
          accessibilityLanguage="ar"
        >
          <Text
            style={styles.dropdownText}
            accessibilityRole="text"
            accessibilityLanguage="ar"
          >
            اختر الفحص
          </Text>
          <Ionicons
            name={showDropdown ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={theme.colors.textPrimary}
            accessibilityRole="image"
            accessibilityLabel={showDropdown ? 'طي القائمة' : 'فتح القائمة'}
            accessibilityLanguage="ar"
          />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownList}>
            {AVAILABLE_TESTS.map(test => (
              <TouchableOpacity
                key={test.key}
                style={styles.dropdownItem}
                onPress={() => selectTest(test.key)}
                activeOpacity={0.85}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`اختيار فحص ${test.label}`}
                accessibilityHint="اضغط لإضافة هذا الفحص إلى قائمة الفحوصات التي سيتم حسابها"
                accessibilityLanguage="ar"
              >
                <Text
                  style={styles.dropdownItemText}
                  accessibilityRole="text"
                  accessibilityLanguage="ar"
                >
                  {test.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        accessibilityLanguage="ar"
      >
        {/* بطاقات إدخال الفحوصات المختارة */}
        {tests.map(key => (
          <TestCard
            key={key}
            testKey={key}
            values={values}
            onChangeValue={updateValue}
            onRemove={() => removeTest(key)}
          />
        ))}

        {/* زر حساب القيم */}
        {tests.length > 0 && (
          <TouchableOpacity
            style={styles.calcButton}
            onPress={analyze}
            activeOpacity={0.9}
            accessible
            accessibilityRole="button"
            accessibilityLabel="احسب القيم الطبية"
            accessibilityHint="يضغط لحساب المؤشرات والقيم الطبية اعتماداً على البيانات المدخلة"
            accessibilityLanguage="ar"
          >
            <Text
              style={styles.calcText}
              accessibilityRole="text"
              accessibilityLanguage="ar"
            >
              احسب
            </Text>
          </TouchableOpacity>
        )}

        {/* نتائج التحليل */}
        {results.map(r => (
          <ResultCard
            key={r.key}
            label={r.label}
            status={r.status}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    paddingHorizontal: theme.spacing.lg,
  },
  backText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  dropdownContainer: {
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.light,
  },
  dropdownText: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  dropdownList: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    marginTop: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.light,
  },
  dropdownItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  dropdownItemText: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    textAlign: 'right',
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
  },
  calcButton: {
    backgroundColor: theme.colors.buttonPrimary,
    borderRadius: theme.radii.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginVertical: theme.spacing.md,
    ...theme.shadows.light,
  },
  calcText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
});

export default MedicalIndicatorsScreen;
