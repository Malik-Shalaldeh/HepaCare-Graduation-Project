import { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HelpButton from '../componentHelp/ButtonHelp';
import ENDPOINTS from '../malikEndPoint';

// ✅ استدعاء ملف الثيم
import theme from '../style/theme';

export default function TestResultsScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      setFilteredResults([]);
      return;
    }

    try {
      const doctorId = await AsyncStorage.getItem('doctor_id');
      const res = await axios.get(ENDPOINTS.TEST_RESULTS.SEARCH, {
        params: { query, doctor_id: doctorId },
      });

      setFilteredResults(res.data);
    } catch (error) {
      console.error('Error fetching results:', error);
      Alert.alert('خطأ', 'فشل في جلب البيانات. تأكد من الاتصال أو من صلاحية الدخول.');
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={styles.card}
      accessible
      accessibilityRole="text"
      accessibilityLabel={`نتيجة فحص للمريض ${item.name}، رقم المريض ${item.patientId}، نوع الفحص ${item.test}، النتيجة ${item.result}، التقييم ${item.evaluation}`}
      accessibilityHint="يعرض تفاصيل نتيجة الفحص مع إمكانية فتح الملف المرفق إن وجد"
      accessibilityLanguage="ar"
    >
      <Text style={styles.name}>
        👤 {item.name} (رقم: {item.patientId})
      </Text>
      <Text style={styles.test}>🧪 الفحص: {item.test}</Text>
      <Text style={styles.result}>📊 النتيجة: {item.result}</Text>
      <Text style={styles.evaluation}>📈 التقييم: {item.evaluation}</Text>
      <Text style={styles.note}>💬 ملاحظة الطبيب: {item.doctorNote}</Text>
      <Text style={styles.note}>📅 تاريخ الفحص: {item.dat}</Text>

      <TouchableOpacity
        style={[styles.searchButton, styles.fileButton]}
        onPress={() =>
          item.filePath
            ? Linking.openURL(`${ENDPOINTS.TEST_RESULTS.FILE_BASE}/${item.filePath}`)
            : Alert.alert('تنبيه', 'لا يوجد ملف مرفق لهذا الفحص', [{ text: 'موافق' }])
        }
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityLabel="فتح ملف الفحص"
        accessibilityHint="يفتح ملف الفحص المرفق إن كان متوفراً"
        accessibilityLanguage="ar"
      >
        <Text style={styles.btn}>فتح ملف الفحص</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View
      style={styles.container}
      accessibilityLanguage="ar"
    >
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
        <Text style={styles.backText}>رجوع</Text>
      </TouchableOpacity>

      {/* العنوان */}
      <Text
        style={styles.header}
        accessible
        accessibilityRole="header"
        accessibilityLabel="ابحث عن فحوصات المريض"
        accessibilityLanguage="ar"
      >
       ابحث عن فحوصات المريض
      </Text>

      {/* حقل البحث */}
      <TextInput
        style={styles.input}
        placeholder="...ادخل اسم أو رقم المريض"
        placeholderTextColor={theme.colors.textMuted}
        onChangeText={setSearchInput}
        value={searchInput}
        textAlign="right"
        autoCapitalize="none"
        accessible
        accessibilityRole="search"
        accessibilityLabel="حقل البحث عن المريض"
        accessibilityHint="أدخل اسم المريض أو رقمه ثم اضغط على زر بحث لعرض النتائج"
        accessibilityLanguage="ar"
      />

      {/* زر البحث */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        activeOpacity={0.9}
        accessible
        accessibilityRole="button"
        accessibilityLabel="بحث عن نتائج الفحوصات"
        accessibilityHint="يضغط للبحث عن نتائج الفحوصات بناءً على الاسم أو الرقم المدخل"
        accessibilityLanguage="ar"
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.background}
          accessibilityRole="image"
          accessibilityLabel="أيقونة بحث"
          accessibilityLanguage="ar"
        />
        <Text style={styles.searchButtonText}>بحث</Text>
      </TouchableOpacity>

      {/* قائمة النتائج */}
      <FlatList
        data={filteredResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          filteredResults.length === 0 && searchInput.trim() !== '' ? (
            <Text
              style={styles.emptyText}
              accessible
              accessibilityRole="text"
              accessibilityLabel="لا يوجد نتائج مطابقة لبيانات البحث"
              accessibilityLanguage="ar"
            >
              لا يوجد نتائج
            </Text>
          ) : null
        }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  backText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
  },
  header: {
    fontSize: theme.typography.headingMd,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    color: theme.colors.textPrimary,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  input: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.md,
    padding: theme.spacing.md,
    fontSize: theme.typography.bodyLg,
    marginBottom: theme.spacing.sm,
    borderColor: theme.colors.border,
    borderWidth: 1,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.radii.md,
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.xl,
    ...theme.shadows.light,
  },
  fileButton: {
    backgroundColor: theme.colors.success,
    marginTop: theme.spacing.sm,
  },
  searchButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.bodyLg,
    marginLeft: theme.spacing.sm,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
  btn: {
    color: theme.colors.background,
    fontSize: theme.typography.bodySm,
    marginLeft: theme.spacing.sm,
    fontWeight: 'bold',
    fontFamily: theme.typography.fontFamily,
  },
  card: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    ...theme.shadows.light,
  },
  name: {
    fontWeight: 'bold',
    fontSize: theme.typography.headingSm,
    marginBottom: theme.spacing.xs,
    color: theme.colors.textPrimary,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  test: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  result: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.textPrimary,
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  evaluation: {
    fontSize: theme.typography.bodyLg,
    color: theme.colors.success,
    marginBottom: 4,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  note: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textSecondary,
    textAlign: 'right',
    marginBottom: 2,
    fontFamily: theme.typography.fontFamily,
  },
  emptyText: {
    textAlign: 'center',
    color: theme.colors.textMuted,
    fontSize: theme.typography.bodyLg,
    marginTop: theme.spacing.lg,
    fontFamily: theme.typography.fontFamily,
  },
});
