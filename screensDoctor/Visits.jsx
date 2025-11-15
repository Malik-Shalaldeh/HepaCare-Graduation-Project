// By sami: شاشة الزيارات الأصلية مع زر إضافي لسجل الزيارات
// By sami: واجهة الزيارات الجديدة – تبدأ بالبحث ثم تظهر الخيارات

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import ENDPOINTS from '../samiendpoint';
import ButtonHelp from '../componentHelp/ButtonHelp';
import theme from '../style/theme';

const Visits = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  // جلب معرف الطبيب عند تحميل الشاشة
  useEffect(() => {
    const fetchDoctorId = async () => {
      try {
        const doctorId = await AsyncStorage.getItem('doctor_id');
        if (!doctorId) {
          Alert.alert('خطأ', 'يرجى تسجيل الدخول مرة أخرى');
          return;
        }

        // جلب المرضى
        await searchPatients(doctorId);
      } catch (error) {
        console.error('خطأ في جلب معرف الطبيب:', error);
        Alert.alert('خطأ', 'تعذر جلب بيانات الطبيب');
      }
    };

    fetchDoctorId();
  }, []);

  // البحث عن المرضى
  const searchPatients = async (doctorId, query = '') => {
    setLoading(true);
    try {
      const response = await axios.get(ENDPOINTS.searchPatients, {
        params: {
          query: query,
          doctor_id: doctorId,
        },
      });

      setPatients(response.data || []);
    } catch (error) {
      console.error('خطأ في البحث عن المرضى:', error);
      Alert.alert('خطأ', 'تعذر جلب قائمة المرضى');
    } finally {
      setLoading(false);
    }
  };

  // تصفية المرضى محليًا
  const filteredPatients = patients.filter(
    p =>
      p.name.toLowerCase().includes(searchText.toLowerCase()) ||
      String(p.id).includes(searchText)
  );

  // إعادة تعيين selectedPatient عند دخول الشاشة
  useEffect(() => {
    setSelectedPatient(null);
  }, []);

  const renderPatientItem = ({ item }) => (
    <TouchableOpacity
      style={styles.resultItem}
      onPress={() => setSelectedPatient(item)}
      activeOpacity={0.8}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`المريض ${item.name}، رقم المريض ${item.id}`}
      accessibilityHint="اضغط لاختيار هذا المريض وعرض خيارات الزيارات الخاصة به"
      accessibilityLanguage="ar"
    >
      <Text style={styles.resultText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWithDrawer title="الزيارات">
      <SafeAreaView style={styles.screenContainer}>
        {!selectedPatient ? (
          <>
            {/* مربع البحث عن المريض */}
            <View
              style={styles.searchContainer}
              accessible
              accessibilityRole="search"
              accessibilityLabel="بحث عن مريض"
              accessibilityHint="أدخل اسم المريض أو رقمه لعرض النتائج المطابقة"
              accessibilityLanguage="ar"
            >
              <TextInput
                style={styles.searchInput}
                placeholder="ابحث عن المريض..."
                placeholderTextColor={theme.colors.textMuted}
                value={searchText}
                onChangeText={async text => {
                  setSearchText(text);
                  const doctorId = await AsyncStorage.getItem('doctor_id');
                  if (doctorId) {
                    searchPatients(doctorId, text);
                  }
                }}
                textAlign="right"
                autoCapitalize="none"
                accessible
                accessibilityRole="search"
                accessibilityLabel="حقل إدخال للبحث عن المريض"
                accessibilityHint="اكتب اسم المريض أو رقمه لعرض قائمة المرضى المطابقين"
                accessibilityLanguage="ar"
              />
              <Ionicons
                name="search"
                size={20}
                color={theme.colors.textMuted}
                style={styles.searchIcon}
                accessibilityRole="image"
                accessibilityLabel="أيقونة بحث"
                accessibilityLanguage="ar"
              />
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text
                  style={styles.loadingText}
                  accessible
                  accessibilityRole="text"
                  accessibilityLabel="جارِ تحميل قائمة المرضى"
                  accessibilityLanguage="ar"
                >
                  جارِ التحميل...
                </Text>
              </View>
            ) : (
              searchText.trim().length > 0 && (
                <FlatList
                  data={filteredPatients}
                  keyExtractor={item => item.id}
                  renderItem={renderPatientItem}
                  ListEmptyComponent={
                    filteredPatients.length === 0 ? (
                      <Text
                        style={styles.noResults}
                        accessible
                        accessibilityRole="text"
                        accessibilityLabel="لا يوجد نتائج مطابقة لبيانات البحث"
                        accessibilityLanguage="ar"
                      >
                        لا يوجد نتائج مطابقة.
                      </Text>
                    ) : null
                  }
                  contentContainerStyle={{ paddingBottom: theme.spacing.sm }}
                />
              )
            )}
          </>
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            accessibilityLanguage="ar"
          >
            {/* زر العودة لاختيار مريض آخر */}
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedPatient(null)}
              activeOpacity={0.8}
              accessible
              accessibilityRole="button"
              accessibilityLabel="العودة لاختيار مريض آخر"
              accessibilityHint="اضغط للرجوع إلى قائمة المرضى"
              accessibilityLanguage="ar"
            >
              <Ionicons
                name="arrow-back"
                size={26}
                color={theme.colors.primary}
                accessibilityRole="image"
                accessibilityLabel="سهم رجوع"
                accessibilityLanguage="ar"
              />
            </TouchableOpacity>

            {/* زر تقييم زيارة المريض */}
            <TouchableOpacity
              style={[styles.button, styles.evaluateButton]}
              onPress={() =>
                navigation.navigate('تقييم الزيارة', {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                })
              }
              activeOpacity={0.9}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`تقييم زيارة المريض ${selectedPatient.name}`}
              accessibilityHint="يفتح شاشة تقييم الزيارة الحالية للمريض"
              accessibilityLanguage="ar"
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={theme.colors.buttonPrimaryText}
                  accessibilityRole="image"
                  accessibilityLabel="أيقونة مستند تقييم"
                  accessibilityLanguage="ar"
                />
                <Text
                  style={[styles.buttonText, styles.buttonTextPrimary]}
                  accessibilityRole="text"
                  accessibilityLanguage="ar"
                >
                  تقييم زيارة المريض
                </Text>
              </View>
            </TouchableOpacity>

            {/* زر عرض سجل الزيارات */}
            <TouchableOpacity
              style={[styles.button, styles.historyButton]}
              onPress={() =>
                navigation.navigate('سجل الزيارات', {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                })
              }
              activeOpacity={0.9}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`عرض سجل زيارات المريض ${selectedPatient.name}`}
              accessibilityHint="يفتح قائمة بجميع الزيارات المسجلة للمريض"
              accessibilityLanguage="ar"
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="calendar-outline"
                  size={24}
                  color={theme.colors.buttonInfoText}
                  accessibilityRole="image"
                  accessibilityLabel="أيقونة تقويم الزيارات"
                  accessibilityLanguage="ar"
                />
                <Text
                  style={[styles.buttonText, styles.buttonTextInfo]}
                  accessibilityRole="text"
                  accessibilityLanguage="ar"
                >
                  عرض سجل الزيارات
                </Text>
              </View>
            </TouchableOpacity>

            {/* زر ملخص الزيارات */}
            <TouchableOpacity
              style={[styles.button, styles.summaryButton]}
              onPress={() =>
                navigation.navigate('ملخص الزيارات', {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                })
              }
              activeOpacity={0.9}
              accessible
              accessibilityRole="button"
              accessibilityLabel={`عرض ملخص الزيارات للمريض ${selectedPatient.name}`}
              accessibilityHint="يعرض ملخصاً عاماً للزيارات والتقييمات الخاصة بالمريض"
              accessibilityLanguage="ar"
            >
              <View style={styles.buttonContent}>
                <Ionicons
                  name="logo-reddit"
                  size={24}
                  color={theme.colors.buttonSecondaryText}
                  accessibilityRole="image"
                  accessibilityLabel="أيقونة ملخص"
                  accessibilityLanguage="ar"
                />
                <Text
                  style={[styles.buttonText, styles.buttonTextSecondary]}
                  accessibilityRole="text"
                  accessibilityLanguage="ar"
                >
                  ملخص الزيارات
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginHorizontal: theme.spacing.lg,
    marginTop: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background,
    padding:10,
  },
  searchInput: {
    flex: 1,
    textAlign: 'right',
    fontSize: theme.typography.bodyMd+2,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    paddingVertical: Platform.OS === 'ios' ? theme.spacing.sm : 0,
  },
  searchIcon: {
    marginLeft: theme.spacing.xs,
  },
  resultItem: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 0.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  resultText: {
    textAlign: 'right',
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  noResults: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.textMuted,
    fontSize: theme.typography.bodyMd,
    fontFamily: theme.typography.fontFamily,
  },
  scrollContainer: {
    padding: theme.spacing.lg,
    paddingTop: theme.spacing.md,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.lg,
  },
  button: {
    borderRadius: theme.radii.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.light,
  },
  evaluateButton: {
    backgroundColor: theme.colors.buttonPrimary,
  },
  historyButton: {
    backgroundColor: theme.colors.buttonInfo,
  },
  summaryButton: {
    backgroundColor: theme.colors.buttonSecondary,
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    fontSize: theme.typography.bodyLg,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
    marginLeft: theme.spacing.xs,
  },
  buttonTextPrimary: {
    color: theme.colors.buttonPrimaryText,
  },
  buttonTextInfo: {
    color: theme.colors.buttonInfoText,
  },
  buttonTextSecondary: {
    color: theme.colors.buttonSecondaryText,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  },
});

export default Visits;
