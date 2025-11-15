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
import ENDPOINTS from '../malikEndPoint'; // ✅ استدعاء ملف الاندبوينت

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
    <View style={styles.card}>
      <Text style={styles.name}>👤 {item.name} (رقم: {item.patientId})</Text>
      <Text style={styles.test}>🧪 الفحص: {item.test}</Text>
      <Text style={styles.result}>📊 النتيجة: {item.result}</Text>
      <Text style={styles.evaluation}>📈 التقييم: {item.evaluation}</Text>
      <Text style={styles.note}>💬 ملاحظة الطبيب: {item.doctorNote}</Text>
      <Text style={styles.note}>📅 تاريخ الفحص: {item.dat}</Text>

      <TouchableOpacity
        style={styles.searchButton}
        onPress={() =>
          item.filePath? Linking.openURL(`${ENDPOINTS.TEST_RESULTS.FILE_BASE}/${item.filePath}`)
            : Alert.alert('تنبيه', 'لا يوجد ملف مرفق لهذا الفحص', [{ text: 'موافق' }])
        }
      >
        <Text style={styles.btn}>فتح ملف الفحص</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name='arrow-back' size={24} color='#000' />
      </TouchableOpacity>

      <Text style={styles.header}>🔍 ابحث عن فحوصات المريض</Text>

      <TextInput
        style={styles.input}
        placeholder='...ادخل اسم أو رقم المريض'
        onChangeText={setSearchInput}
        value={searchInput}
      />

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Ionicons name='search' size={20} color='#fff' />
        <Text style={styles.searchButtonText}>بحث</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredResults}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={
          filteredResults.length === 0 && searchInput.trim() !== '' ? (
            <Text style={styles.emptyText}>لا يوجد نتائج</Text>
          ) : null
        }
      />
      <HelpButton
        title="شاشة عرض النتائج"
        info="تُستخدم هذه الشاشة للاستعلام عن نتائج الفحوصات للمرضى، وذلك بإدخال اسم المريض أو رقمه، ثم عرض التفاصيل وفتح ملف الفحص عند توفره."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2C3E50',
    textAlign: 'right',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    textAlign: 'right',
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980B9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  btn: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 6,
    color: '#34495E',
    textAlign: 'right',
  },
  test: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'right',
  },
  result: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 4,
    textAlign: 'right',
  },
  evaluation: {
    fontSize: 16,
    color: '#27ae60',
    marginBottom: 4,
    textAlign: 'right',
  },
  note: {
    fontSize: 15,
    color: '#7f8c8d',
    textAlign: 'right',
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
});
