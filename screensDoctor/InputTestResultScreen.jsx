import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Platform,
  StatusBar,
  Switch,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function InputTestResultScreen() {
  const navigation = useNavigation();

  // لإخفاء الهيدر الأصلي
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // بيانات المرضى (يمكن استبدالها باستدعاء API)
  const patientsList = [
    { id: '1001', name: 'أحمد خالد' },
    { id: '1002', name: 'سارة محمود' },
    { id: '1003', name: 'محمد علي' },
  ];
  const testsList = [
    'CBC',
    'PCR*',
    'ELISA*',
    'CHEMISTRY',
    'COAGULATION',
    'HBSAG**',
    'HBSAB**',
    'HBCAB**',
  ];

  // حالات الواجهة
  const [searchInput, setSearchInput] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const [selectedTest, setSelectedTest] = useState('');
  const [file, setFile] = useState(null);
  const [resultValue, setResultValue] = useState('');
  const [date, setDate] = useState(new Date());           // التاريخ المؤكد
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isNormal, setIsNormal] = useState(true);
  const [note, setNote] = useState('');

  // بحث عن المريض
  const handlePatientSearch = () => {
    const results = patientsList.filter(p =>
      p.id === searchInput.trim() ||
      p.name.includes(searchInput.trim())
    );
    setFilteredPatients(results);
  };

  // اختيار ملف الفحص
  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (result.type === 'success') {
      setFile(result);
    }
  };

  // حفظ النتيجة (يمكن تعديلها لإرسال البيانات إلى الخادم)
  const handleSave = () => {
    const payload = {
      patient: selectedPatient,
      test: selectedTest,
      date,
      resultValue,
      file,
      evaluation: isNormal ? 'طبيعي' : 'غير طبيعي',
      note,
    };
    console.log('Saving:', payload);
    // TODO: إرسال payload إلى الـ API

    // إعادة تهيئة الشاشة
    setSelectedPatient(null);
    setSearchInput('');
    setFilteredPatients([]);
    setSelectedTest('');
    setFile(null);
    setResultValue('');
    setDate(new Date());
    setShowDatePicker(false);
    setIsNormal(true);
    setNote('');
  };

  // تنسيق التاريخ للعرض
  const formatDate = d => {
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // شاشة البحث عن المرضى
  if (!selectedPatient) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text style={styles.header}>🩺 إدخال نتائج الفحص</Text>

        <TextInput
          style={styles.input}
          placeholder="...ابحث برقم أو اسم المريض"
          value={searchInput}
          onChangeText={setSearchInput}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handlePatientSearch}>
          <Ionicons name="search" size={20} color="#fff" />
          <Text style={styles.searchButtonText}>بحث</Text>
        </TouchableOpacity>

        <FlatList
          data={filteredPatients}
          keyExtractor={item => item.id}
          style={{ marginTop: 10 }}
          ListEmptyComponent={() =>
            searchInput !== '' ? <Text style={styles.emptyText}>لا يوجد مرضى</Text> : null
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => setSelectedPatient(item)}
            >
              <Text style={styles.name}>👤 {item.name}</Text>
              <Text style={styles.subInfo}>رقم: {item.id}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // شاشة إدخال تفاصيل نتيجة الفحص
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => setSelectedPatient(null)}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>🩺 إدخال نتائج الفحص</Text>

      <View style={styles.card}>
        <Text style={styles.name}>
          👤 {selectedPatient.name} (#{selectedPatient.id})
        </Text>

        {/* اختيار اسم الفحص */}
        <Text style={styles.label}>اختر اسم الفحص:</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedTest}
            onValueChange={v => setSelectedTest(v)}
          >
            <Picker.Item label="-- اختر الفحص --" value="" />
            {testsList.map(test => (
              <Picker.Item key={test} label={test} value={test} />
            ))}
          </Picker>
        </View>

        {selectedTest !== '' && (
          <>
            {/* اختيار التاريخ */}
            <Text style={styles.label}>تاريخ الفحص:</Text>
            <View style={styles.dateRow}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateButtonText}>اختر التاريخ</Text>
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (Platform.OS !== 'ios') {
                    setShowDatePicker(false);
                  }
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
              />
            )}

            {/* النتيجة الرقمية */}
            <Text style={styles.label}>النتيجة الرقمية:</Text>
            <TextInput
              style={styles.input}
              placeholder="ادخل قيمة الفحص"
              keyboardType="numeric"
              value={resultValue}
              onChangeText={setResultValue}
            />

            {/* رفع الملف */}
            <Text style={styles.label}>رفع ملف الفحص:</Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
              <Ionicons name="cloud-upload-outline" size={20} color="#2980B9" />
              <Text style={styles.uploadText}>
                {file ? file.name : 'اضغط لرفع الملف'}
              </Text>
            </TouchableOpacity>

            {/* تقييم الفحص */}
            <Text style={styles.label}>تقييم الفحص:</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>
                {isNormal ? 'طبيعي' : 'غير طبيعي'}
              </Text>
              <Switch value={isNormal} onValueChange={setIsNormal} />
            </View>

            {/* ملاحظات الطبيب */}
            <Text style={styles.label}>ملاحظات الطبيب:</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              placeholder="اكتب ملاحظاتك هنا"
              multiline
              value={note}
              onChangeText={setNote}
            />

            {/* أزرار الحفظ والإلغاء */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: '#27ae60' }]}
                onPress={handleSave}
              >
                <Text style={styles.searchButtonText}>حفظ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.searchButton, { backgroundColor: '#c0392b' }]}
                onPress={() => setSelectedPatient(null)}
              >
                <Text style={styles.searchButtonText}>إلغاء</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android'
      ? StatusBar.currentHeight + 10
      : 30,
    paddingBottom: Platform.OS === 'android'
      ? 20  // يمنع تداخل المحتوى مع أزرار نظام Android السفلية
      : 30,
  },
  backButton: {
    marginBottom: 15,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2C3E50',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2980B9',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#34495E',
  },
  subInfo: {
    fontSize: 15,
    color: '#7f8c8d',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#2C3E50',
    marginTop: 12,
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#eef6fb',
    borderRadius: 12,
  },
  uploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#2980B9',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateText: {
    fontSize: 16,
    color: '#2C3E50',
  },
  dateButton: {
    backgroundColor: '#2980B9',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});
