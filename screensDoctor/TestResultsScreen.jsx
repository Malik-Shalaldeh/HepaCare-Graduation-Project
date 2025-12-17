// TestResultsScreen.jsx

import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENDPOINTS from '../malikEndPoint';
import theme from '../style/theme';

export default function TestResultsScreen() {
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const navigation = useNavigation();

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
      Alert.alert(
        'خطأ',
        'فشل في جلب البيانات. تأكد من الاتصال أو من صلاحية الدخول.'
      );
    }
  };

  const renderItem = ({ item }) => (
    
    <View style={styles.card}>
      <Text style={styles.name}>
        👤 {item.name} (رقم: {item.patientId})
      </Text>

      <Text style={styles.test}>🧪 الفحص: {item.test}</Text>
      <Text style={styles.test}>🧪 نوع الفحص: {item.type || 'لا يوجد'}</Text>
      <Text style={styles.result}>📊 النتيجة: {item.result}</Text>
      <Text style={styles.evaluation}>📈 التقييم: {item.evaluation}</Text>
      <Text style={styles.note}>💬 ملاحظة الطبيب: {item.doctorNote}</Text>
      <Text style={styles.note}>📅 تاريخ الفحص: {item.dat}</Text>

      <TouchableOpacity
        style={[styles.searchButton, styles.fileButton]}
        onPress={() => {
          if (item.filePath) {
            const normalizedPath = item.filePath.replace(/\\/g, '/');
            const directUrl = `${ENDPOINTS.TEST_RESULTS.FILE_BASE}/${normalizedPath}`;
            const encodedUrl = encodeURIComponent(directUrl);

            // افتح PDF داخل Google Viewer
            navigation.navigate("FileViewer", {
              fileUrl: `https://docs.google.com/gview?embedded=true&url=${encodedUrl}`
            });
          } else {
            Alert.alert("تنبيه", "لا يوجد ملف مرفق لهذا الفحص");
          }
        }}
        activeOpacity={0.8}
      >
        <Text style={styles.btn}>فتح ملف الفحص</Text>
      </TouchableOpacity>


    </View>
  );

  return (
    <View style={styles.container}>
      {/* العنوان */}
      <Text style={styles.header}>ابحث عن فحوصات المريض</Text>

      {/* حقل البحث */}
      <TextInput
        style={styles.input}
        placeholder="...ادخل اسم أو رقم المريض"
        placeholderTextColor={theme.colors.textMuted}
        onChangeText={setSearchInput}
        value={searchInput}
        textAlign="right"
      />

      {/* زر البحث */}
      <TouchableOpacity
        style={styles.searchButton}
        onPress={handleSearch}
        activeOpacity={0.9}
      >
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.background}
        />
        <Text style={styles.searchButtonText}>بحث</Text>
      </TouchableOpacity>

      {/* قائمة النتائج */}
      <FlatList
        data={filteredResults}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          filteredResults.length === 0 && searchInput.trim() !== '' ? (
            <Text style={styles.emptyText}>لا يوجد نتائج</Text>
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
