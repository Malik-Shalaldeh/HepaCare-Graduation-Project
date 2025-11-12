// screens/MedicalIndicatorsScreen.jsx
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
import ResultCard from '../componentDoctor/ResultCardincedators';
import TestCard from '../componentDoctor/TestCardindicator'

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

  const selectTest = key => {
    if (!tests.includes(key)) {
      setTests(prev => [...prev, key]);

      if (key === 'FIB4') {
        setValues(prev => ({ ...prev, FIB4_age:'', FIB4_ast:'', FIB4_alt:'', FIB4_platelets:'' }));
      } else if (key === 'APRI') {
        setValues(prev => ({ ...prev, APRI_ast:'', APRI_uln:'', APRI_platelets:'' }));
      } else {
        setValues(prev => ({ ...prev, [key]: '' }));
      }

      setResults([]);
      setShowDropdown(false);
    }
  };

  const removeTest = key => {
    setTests(prev => prev.filter(t => t !== key));
    setResults(prev => prev.filter(r => r.key !== key));
  };

  const updateValue = (key, textvalue) => {
    setValues(prev => ({ ...prev, [key]: textvalue }));
  };

  const analyze = () => {
    const newResults = tests.map(key => {
      let status = '❌ Invalid';

      if (key === 'FIB4') {
        const age = parseFloat(values.FIB4_age);
        const ast = parseFloat(values.FIB4_ast);
        const alt = parseFloat(values.FIB4_alt);
        const plt = parseFloat(values.FIB4_platelets);

        if (![age, ast, alt, plt].some(v => isNaN(v))) {
          const fib4 = (age * ast) / (0.001 * plt * Math.sqrt(alt));
          const val = fib4.toFixed(2);

          if (fib4 < 1.45) status = `${val} - Less probable cirrhosis`;
          else if (fib4 <= 3.25) status = `${val} - Indeterminate`;
          else status = `${val} - More probable cirrhosis`;
        }
      } else if (key === 'APRI') {
        const ast = parseFloat(values.APRI_ast);
        const uln = parseFloat(values.APRI_uln);
        const plt = parseFloat(values.APRI_platelets);

        if (![ast, uln, plt].some(v => isNaN(v))) {
          const apri = ((ast / uln) / plt) * 100;
          status = `${apri.toFixed(2)}%`;
        }
      } else {
        const raw = parseFloat(values[key]);
        if (!isNaN(raw)) {
          switch (key) {
            case 'ALT':       status = raw > 40  ? 'High' : 'Normal'; break;
            case 'AST':       status = raw > 40  ? 'High' : 'Normal'; break;
            case 'Bilirubin': status = raw > 1.2 ? 'High' : 'Normal'; break;
            case 'INR':       status = raw > 1.1 ? 'High' : 'Normal'; break;
            case 'Platelets': status = raw < 150 ? 'Low'  : 'Normal'; break;
          }
        }
      }

      return {
        key,
        label: AVAILABLE_TESTS.find(t => t.key === key).label,
        status,
      };
    });

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
              <TouchableOpacity key={test.key} style={styles.dropdownItem} onPress={() => selectTest(test.key)}>
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
