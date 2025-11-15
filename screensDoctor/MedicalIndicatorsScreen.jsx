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

const primary = '#009688';
const cardBg = '#ffffff';
const textPrimary = '#004D40';

const MedicalIndicatorsScreen = () => {
  const navigation = useNavigation();

  const [tests, setTests] = useState([]);
  const [values, setValues] = useState({});
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const selectTest = (key) => 
  {
    if (!tests.includes(key)) {
      setTests(prev => [...prev, key]);

      const initial = getInitialValuesForTest(key);
      setValues(prev => ({ ...prev, ...initial }));

      setResults([]);
      setShowDropdown(false);
    }
  };

  const removeTest = key => {
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={primary} barStyle="dark-content" />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      {/* dropdown */}
      <View style={styles.dropdownContainer}>
        <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>اختر الفحص</Text>
          <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color={textPrimary} />
        </TouchableOpacity>

        {showDropdown && (
          <View style={styles.dropdownList}>
            {AVAILABLE_TESTS.map(test => (
              <TouchableOpacity
                key={test.key}
                style={styles.dropdownItem}
                onPress={() => selectTest(test.key)}
              >
                <Text style={styles.dropdownItemText}>{test.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {tests.map(key => (
          <TestCard
            key={key}
            testKey={key}
            values={values}
            onChangeValue={updateValue}
            onRemove={() => removeTest(key)}
          />
        ))}

        {tests.length > 0 && (
          <TouchableOpacity style={styles.calcButton} onPress={analyze}>
            <Text style={styles.calcText}>احسب</Text>
          </TouchableOpacity>
        )}

        {results.map(r => (
          <ResultCard key={r.key} label={r.label} status={r.status} />
        ))}
        
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  backButton: {
    margin: 10,
  },

  dropdownContainer: {
    margin: 16,
  },

  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: cardBg,
    borderRadius: 8,
    elevation: 1,
  },

  dropdownText: {
    fontSize: 16,
    color: textPrimary,
  },

  dropdownList: {
    backgroundColor: cardBg,
    borderRadius: 8,
    marginTop: 4,
    elevation: 1,
  },

  dropdownItem: {
    padding: 12,
  },

  dropdownItemText: {
    fontSize: 16,
    color: textPrimary,
  },

  content: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 30 : 20,
  },

  calcButton: {
    backgroundColor: primary,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginVertical: 12,
  },

  calcText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MedicalIndicatorsScreen;
