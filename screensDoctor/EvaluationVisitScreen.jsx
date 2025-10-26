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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';


const primary = '#00b29c';

const EvaluationVisitScreen = () => {
  const navigation = useNavigation();
  
  const route = useRoute();
  const { patientId, patientName } = route.params || {};

  useEffect(() => {
    if (!patientId) {
      navigation.goBack();
    }
  }, [patientId, navigation]);

  // عند كل مرة تظهر فيها الشاشة نفرّغ الحقول
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

  const [condition, setCondition] = useState('');
  const [adherence, setAdherence] = useState('');
  const [notes, setNotes] = useState('');
  const [psychosocial, setPsychosocial] = useState('');

  const handleSave = async () => {
  if (!condition || !adherence) {
    Alert.alert('⚠️ تنبيه', 'يرجى اختيار الحالة العامة والالتزام قبل الحفظ.');
    return;
  }

  try {
    await axios.post('http://192.168.1.8:8000/visits/', {
      patient_id: patientId,
      visit_date: new Date().toISOString(), // 👈 التاريخ الحالي بصيغة ISO
      general_state:
        condition === 'جيدة' ? 'GOOD' :
        condition === 'متوسطة' ? 'MEDIUM' : 'BAD',
      adherence:
        adherence === 'نعم' ? 'YES' :
        adherence === 'لا' ? 'NO' : 'SOMETIMES',
      doctor_notes: notes,
      psychological_notes: psychosocial,
    });

    Alert.alert('✅ تم حفظ التقييم للمريض: ' + patientName);

    setCondition('');
    setAdherence('');
    setNotes('');
    setPsychosocial('');
    
  } catch (error) {
    console.error(error);
    Alert.alert('خطأ', 'لا يمكن تكرار الزيارة في نفس التاريخ وتاكد من المعلومات المدخلة');
  }
};


  const renderOptionGroup = (label, options, selected, onSelect) => (
    <View style={styles.optionGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[
              styles.optionButton,
              selected === option && styles.optionSelected,
            ]}
            onPress={() => onSelect(option)}
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
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={primary}
        barStyle="dark-content"
        translucent={false}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={26} color={primary} />
        </TouchableOpacity>

        <Text style={styles.title}>تقييم زيارة المريض 🩺</Text>
        <Text style={styles.patientInfo}>
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

        <Text style={styles.label}>3. ملاحظات الطبيب</Text>
        <TextInput
          placeholder="ملاحظات طبية..."
          style={styles.textInput}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        <Text style={styles.label}>4. ملاحظات نفسية / اجتماعية</Text>
        <TextInput
          placeholder="مثال: اكتئاب، قلق، دعم عائلي..."
          style={styles.textInput}
          multiline
          value={psychosocial}
          onChangeText={setPsychosocial}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>💾 حفظ التقييم</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EvaluationVisitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginVertical: 20,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  patientInfo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
    marginBottom: 10,
    textAlign: 'right',
  },
  textInput: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 10,
    minHeight: 80,
    fontSize: 15,
    marginBottom: 25,
    textAlignVertical: 'top',
  },
  optionGroup: {
    marginBottom: 25,
  },
  optionsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
  },
  optionSelected: {
    backgroundColor: primary,
    borderColor: primary,
  },
  optionText: {
    color: '#333',
    fontWeight: '600',
  },
  optionTextSelected: {
    color: '#fff',
  },
  button: {
    backgroundColor: primary,
    padding: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
