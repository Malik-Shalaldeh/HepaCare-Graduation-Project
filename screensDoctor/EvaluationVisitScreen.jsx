import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useVisitData } from '../contexts/VisitDataContext';



const primary = '#00b29c';

const EvaluationVisitScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { patientId, patientName } = route.params || {};
  const { addVisit } = useVisitData();

  // الحالة – حدد المريض من الباراميترز
  const [selectedPatient, setSelectedPatient] = useState(
    patientId ? { id: patientId, name: patientName } : null
  );

  useEffect(() => {
    if (patientId && !selectedPatient) {
      setSelectedPatient({ id: patientId, name: patientName });
    }
  }, [patientId, patientName]);

  // بيانات التقييم فقط
  const [condition, setCondition] = useState('');
  const [adherence, setAdherence] = useState('');
  const [notes, setNotes] = useState('');
  const [psychosocial, setPsychosocial] = useState('');

  

  const handleSave = () => {
    if (!condition || !adherence) {
      Alert.alert('⚠️ تنبيه', 'يرجى اختيار الحالة العامة والالتزام قبل الحفظ.');
      return;
    }
    const evaluation = {
      id: Date.now().toString(), // Generate unique ID
      patientId: selectedPatient.id,
      patientName: selectedPatient.name,
      condition,
      adherence,
      notes,
      psychosocial,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      summary: `الحالة: ${condition} | الالتزام: ${adherence}`,
      instructions: 'متابعة الدواء وفق الجدول المحدد',
    };
    
    // Save to context
    addVisit(selectedPatient.id, evaluation);
    
    console.log('✅ تم الحفظ:', evaluation);
    Alert.alert('✅ تم حفظ التقييم للمريض: ' + selectedPatient.name);
    setSelectedPatient(null);
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

  // في حال عدم تمرير مريض، نطلب من المستخدم العودة
  if (!selectedPatient) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={primary} barStyle="dark-content" />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color={primary} />
        </TouchableOpacity>
        <Text style={styles.noResult}>لم يتم اختيار مريض. يرجى العودة واختيار مريض أولاً.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={primary}
        barStyle="dark-content"
        translucent={false}
      />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          onPress={() =>setSelectedPatient(null)}
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
    marginBottom: 10,
    margin: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    marginHorizontal: 25,
  },
  resultItem: {
    backgroundColor: '#f1f9f9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  noResult: {
    textAlign: 'center',
    marginTop: 10,
    color: '#777',
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
    backgroundColor: '#f1f9f1',
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
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
