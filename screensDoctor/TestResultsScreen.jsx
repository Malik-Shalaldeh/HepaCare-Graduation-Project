import { useState, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; 

const sampleResults = [
  {
    id: '1',
    patientId: '1001',
    name: 'أحمد خالد',
    test: 'تحليل كبد ALT',
    result: '45 U/L',
    evaluation: 'مرتفع قليلاً',
    doctorNote: 'ينصح بإعادة الفحص بعد أسبوع وتقليل الدهون.',
    dat: '10/4/2025'
  },
  {
    id: '2',
    patientId: '1002',
    name: 'سارة محمود',
    test: 'تحليل كبد AST',
    result: '32 U/L',
    evaluation: 'طبيعي',
    doctorNote: 'استمر على النظام الغذائي.',
    dat: '5/4/2020'
  },
  {
    id: '3',
    patientId: '1001',
    name: 'أحمد خالد',
    test: 'تحليل بيليروبين',
    result: '1.2 mg/dL',
    evaluation: 'طبيعي',
    doctorNote: 'نتائج ممتازة.',
    dat: '3/8/2015'
  },
];

const TestResultsScreen = () => {
  const [searchInput, setSearchInput] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  const handleSearch = () => {
    const query = searchInput.trim().toLowerCase();
    if (!query) {
      setFilteredResults([]);
      return;
    }
    const results = sampleResults.filter(item =>
      item.patientId.includes(query) ||
      item.name.toLowerCase().includes(query)
    );
    setFilteredResults(results);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>👤 {item.name} (رقم: {item.patientId})</Text>
      <Text style={styles.test}>🧪 الفحص: {item.test}</Text>
      <Text style={styles.result}>📊 النتيجة: {item.result}</Text>
      <Text style={styles.evaluation}>📈 التقييم: {item.evaluation}</Text>
      <Text style={styles.note}>💬 ملاحظة الطبيب: {item.doctorNote}</Text>
      <Text style={styles.note}>📅 تاريخ الفحص: {item.dat}</Text>

      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
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
        autoCapitalize="none"
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
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

  btn : {
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

export default TestResultsScreen;
