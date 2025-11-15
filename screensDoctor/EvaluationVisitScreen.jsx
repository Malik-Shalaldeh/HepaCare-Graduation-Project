import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

const EvaluationVisitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId, patientName } = route.params || {};

  const [condition, setCondition] = useState('');
  const [adherence, setAdherence] = useState('');
  const [notes, setNotes] = useState('');
  const [psychosocial, setPsychosocial] = useState('');

  useEffect(() => {
    if (!patientId) {
      navigation.goBack();
    }
  }, [patientId, navigation]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setCondition('');
      setAdherence('');
      setNotes('');
      setPsychosocial('');
    });
    return unsubscribe;
  }, [navigation]);

  const selectedPatient = { id: patientId, name: patientName };

  const handleSave = async () => {
    if (!condition || !adherence) {
      Alert.alert('⚠️ تنبيه', 'يرجى اختيار الحالة العامة والالتزام قبل الحفظ.');
      return;
    }

    try {
      await axios.post(ENDPOINTS.VISITS.CREATE, {
        patient_id: patientId,
        visit_date: new Date().toISOString(),
        general_state:
          condition === 'جيدة' ? 'GOOD' :
          condition === 'متوسطة' ? 'MEDIUM' : 'BAD',
        adherence:
          adherence === 'نعم' ? 'YES' :
          adherence === 'لا' ? 'NO' : 'SOMETIMES',
        doctor_notes: notes,
        psychological_notes: psychosocial,
      });

      Alert.alert('✅', 'تم حفظ/تعديل التقييم للمريض: ' + patientName);

      setCondition('');
      setAdherence('');
      setNotes('');
      setPsychosocial('');
    } catch (error) {
      Alert.alert('خطأ', 'تأكد من الاتصال أو البيانات.');
    }
  };

  const renderOptionGroup = (label, options, selected, onSelect) => (
    <View style={styles.optionGroup}>
      <Text
        style={styles.label}
        accessible
        accessibilityRole="text"
        accessibilityLabel={label}
        accessibilityLanguage="ar"
      >
        {label}
      </Text>
      <View style={styles.optionsRow}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selected === option && styles.optionSelected,
            ]}
            onPress={() => onSelect(option)}
            activeOpacity={0.85}
            accessible
            accessibilityRole="button"
            accessibilityState={{ selected: selected === option }}
            accessibilityLabel={`${label} - ${option}`}
            accessibilityHint="اضغط لاختيار هذا الخيار"
            accessibilityLanguage="ar"
          >
            <Text
              style={[
                styles.optionText,
                selected === option && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={styles.container}
      accessibilityLanguage="ar"
    >
      <StatusBar
        backgroundColor={theme.colors.primary}
        barStyle="light-content"
        translucent={false}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios'
            ? 0
            : (StatusBar.currentHeight || 0)
        }
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* زر الرجوع */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.8}
            accessible
            accessibilityRole="button"
            accessibilityLabel="رجوع"
            accessibilityHint="العودة إلى الشاشة السابقة"
            accessibilityLanguage="ar"
          >
            <Ionicons
              name="arrow-back"
              size={26}
              color={theme.colors.primary}
              accessibilityRole="image"
              accessibilityLabel="سهم الرجوع"
              accessibilityLanguage="ar"
            />
          </TouchableOpacity>

          {/* العنوان */}
          <Text
            style={styles.title}
            accessible
            accessibilityRole="header"
            accessibilityLabel="تقييم زيارة المريض"
            accessibilityLanguage="ar"
          >
            تقييم زيارة المريض 🩺
          </Text>

          {/* معلومات المريض */}
          <Text
            style={styles.patientInfo}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`المريض ${selectedPatient.name}، رقم المريض ${selectedPatient.id}`}
            accessibilityLanguage="ar"
          >
            المريض: {selectedPatient.name} ({selectedPatient.id})
          </Text>

          {renderOptionGroup(
            '1. الحالة العامة',
            ['جيدة', 'متوسطة', 'سيئة'],
            condition,
            setCondition
          )}

          {renderOptionGroup(
            '2. الالتزام بالعلاج',
            ['نعم', 'لا', 'أحيانًا'],
            adherence,
            setAdherence
          )}

          <Text
            style={styles.label}
            accessible
            accessibilityRole="text"
            accessibilityLabel="3. ملاحظات الطبيب"
            accessibilityLanguage="ar"
          >
            3. ملاحظات الطبيب
          </Text>
          <TextInput
            placeholder="ملاحظات طبية..."
            placeholderTextColor={theme.colors.textMuted}
            style={styles.textInput}
            multiline
            value={notes}
            onChangeText={setNotes}
            textAlign="right"
            accessible
            accessibilityLabel="حقل ملاحظات الطبيب"
            accessibilityHint="أدخل الملاحظات الطبية المتعلقة بزيارة المريض"
            accessibilityLanguage="ar"
          />

          <Text
            style={styles.label}
            accessible
            accessibilityRole="text"
            accessibilityLabel="4. ملاحظات نفسية أو اجتماعية"
            accessibilityLanguage="ar"
          >
            4. ملاحظات نفسية / اجتماعية
          </Text>
          <TextInput
            placeholder="مثال: اكتئاب، قلق، دعم عائلي..."
            placeholderTextColor={theme.colors.textMuted}
            style={styles.textInput}
            multiline
            value={psychosocial}
            onChangeText={setPsychosocial}
            textAlign="right"
            accessible
            accessibilityLabel="حقل الملاحظات النفسية والاجتماعية"
            accessibilityHint="أدخل الملاحظات النفسية أو الاجتماعية المتعلقة بالمريض"
            accessibilityLanguage="ar"
          />

          <View style={{ height: theme.spacing.lg }} />

          {/* زر الحفظ */}
          <TouchableOpacity
            style={styles.button}
            onPress={handleSave}
            activeOpacity={0.9}
            accessible
            accessibilityRole="button"
            accessibilityLabel="حفظ التقييم"
            accessibilityHint="يحفظ تقييم الزيارة الحالية للمريض"
            accessibilityLanguage="ar"
          >
            <Text style={styles.buttonText}>💾 حفظ التقييم</Text>
          </TouchableOpacity>

          <View style={{ height: theme.spacing.xl }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EvaluationVisitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0,
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    flexGrow: 1,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.headingMd,
    fontWeight: 'bold',
    color: theme.colors.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    fontFamily: theme.typography.fontFamily,
  },
  patientInfo: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    fontFamily: theme.typography.fontFamily,
  },
  label: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: theme.spacing.sm,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  textInput: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    minHeight: 80,
    fontSize: theme.typography.bodyMd,
    marginBottom: theme.spacing.xl,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontFamily: theme.typography.fontFamily,
  },
  optionGroup: {
    marginBottom: theme.spacing.xl,
  },
  optionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: theme.colors.buttonSecondary,
    borderColor: theme.colors.buttonSecondary,
  },
  optionText: {
    color: theme.colors.textPrimary,
    fontWeight: '600',
    fontFamily: theme.typography.fontFamily,
  },
  optionTextSelected: {
    color: theme.colors.buttonSecondaryText,
  },
  button: {
    backgroundColor: theme.colors.buttonPrimary,
    padding: theme.spacing.md,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  buttonText: {
    color: theme.colors.buttonPrimaryText,
    fontSize: theme.typography.bodyLg,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
});
