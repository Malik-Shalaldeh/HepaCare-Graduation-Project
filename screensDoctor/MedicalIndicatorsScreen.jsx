import { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const primary = '#009688';
const cardBg = '#ffffff';
const textPrimary = '#004D40';
const textSecondary = '#00695C';

const AVAILABLE_TESTS = [
  { key: 'ALT',       label: 'ALT (U/L)' },
  { key: 'AST',       label: 'AST (U/L)' },
  { key: 'Bilirubin', label: 'Bilirubin (mg/dL)' },
  { key: 'INR',       label: 'INR' },
  { key: 'Platelets', label: 'Platelets (#/μL)' },
  { key: 'FIB4',      label: 'Fibrosis-4' },
  { key: 'APRI',      label: 'APRI' },
];

 // resuse input style
const Input = ({ label, value, onChange }) => (
  <View style={styles.inputRow}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.input}
      keyboardType="numeric"
      value={value}
      onChangeText={onChange}
      placeholder="0"
    />
  </View>
);


const MedicalIndicatorsScreen = () => 
  {
  const navigation = useNavigation();
  
  const [tests, setTests] = useState([]);
  const [values, setValues] = useState({});
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => setShowDropdown(prev => !prev);

  const selectTest = key => {
    if (!tests.includes(key)) 
      {
      setTests(prev => [...prev, key]);

      if (key === 'FIB4') 
      {
        setValues(prev => ({ ...prev, FIB4_age:'', FIB4_ast:'', FIB4_alt:'', FIB4_platelets:'' }));
      } 
      else if (key === 'APRI') 
      {
        setValues(prev => ({ ...prev, APRI_ast:'', APRI_uln:'', APRI_platelets:'' }));
      } 
      else 
      {
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
    const newResults = tests.map(key => 
      {
      let status = '❌ Invalid';

      if (key === 'FIB4') 
        {
        const age = parseFloat(values.FIB4_age);
        const ast = parseFloat(values.FIB4_ast);
        const alt = parseFloat(values.FIB4_alt);
        const plt = parseFloat(values.FIB4_platelets);

        if (![age, ast, alt, plt].some(v => isNaN(v)))
         {
          const fib4 = (age * ast) / (0.001 * plt * Math.sqrt(alt));

          const val = fib4.toFixed(2);
   
          if (fib4 < 1.45) status = `${val} - Less probable cirrhosis`;

          else if (fib4 <= 3.25) status = `${val} - Indeterminate`;

          else status = `${val} - More probable cirrhosis`;
        }
      } 
      else if (key === 'APRI')
       {
        const ast = parseFloat(values.APRI_ast);
        const uln = parseFloat(values.APRI_uln);
        const plt = parseFloat(values.APRI_platelets);

        if (![ast, uln, plt].some(v => isNaN(v)))
        {
          const apri = ((ast / uln) / plt) * 100;
          status = `${apri.toFixed(2)}%`;
        }
      } 
      else 
        {
        const raw = parseFloat(values[key]);

        if (!isNaN(raw)) 
        {
          switch (key) 
          {
            case 'ALT':       status = raw > 40    ? 'High'   : 'Normal'; break;
            case 'AST':       status = raw > 40    ? 'High'   : 'Normal'; break;
            case 'Bilirubin': status = raw > 1.2   ? 'High'   : 'Normal'; break;
            case 'INR':       status = raw > 1.1   ? 'High'   : 'Normal'; break;
            case 'Platelets': status = raw < 150   ? 'Low'    : 'Normal'; break;
          }
        }
      }
      return{ 
         key,
         label: AVAILABLE_TESTS.find(t => t.key === key).label,
         status 
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

      <View style={styles.dropdownContainer}>

        <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
          <Text style={styles.dropdownText}>اختر الفحص</Text>
          <Ionicons name={showDropdown ? 'chevron-up' : 'chevron-down'} size={20} color={textPrimary} />
        </TouchableOpacity>
        {
        showDropdown && (
          <View style={styles.dropdownList}>

            {AVAILABLE_TESTS.map(test => (
              <TouchableOpacity key={test.key} style={styles.dropdownItem} onPress={() => selectTest(test.key)}>
                <Text style={styles.dropdownItemText}>{test.label}</Text>
              </TouchableOpacity>
            ))}
            
          </View>

        )
        }
      </View>

      <ScrollView contentContainerStyle={styles.content}>

        {tests.map(key => (
          <View key={key} style={styles.card}>

            <TouchableOpacity style={styles.removeIcon} onPress={() => removeTest(key)}>
              <Ionicons name="close-circle" size={35} color="#F44336" />
            </TouchableOpacity>

            <Text style={styles.cardTitle}>{AVAILABLE_TESTS.find(t => t.key === key).label}</Text>

            {key === 'FIB4' && 
            (
              <>
                <Input label="Age (yrs)" value={values.FIB4_age} onChange={v => updateValue('FIB4_age', v)} />
                <Input label="AST (U/L)" value={values.FIB4_ast} onChange={v => updateValue('FIB4_ast', v)} />
                <Input label="ALT (U/L)" value={values.FIB4_alt} onChange={v => updateValue('FIB4_alt', v)} />
                <Input label="Platelets" value={values.FIB4_platelets} onChange={v => updateValue('FIB4_platelets', v)} />
              </>
            )}


            {key === 'APRI' && (
              <>
                <Input label="AST (U/L)" value={values.APRI_ast} onChange={v => updateValue('APRI_ast', v)} />
                <Input label="AST ULN" value={values.APRI_uln} onChange={v => updateValue('APRI_uln', v)} />
                <Input label="Platelets" value={values.APRI_platelets} onChange={v => updateValue('APRI_platelets', v)} />
              </>
            )}
            {['ALT','AST','Bilirubin','INR','Platelets'].includes(key) && (
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Enter value"
                value={values[key]}
                onChangeText={t => updateValue(key, t)}
              />
            )}
          </View>
        ))}


        {tests.length > 0 && (
          <TouchableOpacity style={styles.calcButton} onPress={analyze}>
            <Text style={styles.calcText}>احسب</Text>
          </TouchableOpacity>
          
        )}

        {results.map(r => 
        {
          const isHigh = r.status.startsWith('High') || r.status.includes('❌');
          const isLow = r.status.startsWith('Low');
          const icon = isHigh ? 'close-circle' : isLow ? 'warning' : 'checkmark-circle';
          const color = isHigh ? '#F44336' : isLow ? '#FFC107' : '#4CAF50';

          return (
            <View key={r.key} style={styles.resultCard}>
              <Ionicons name={icon} size={24} color={color} />
              <View style={styles.resultTextRow}>
                <Text style={styles.resultLabel}>{r.label}</Text>
                <Text style={styles.resultValue}>{r.status}</Text>
              </View>
            </View>
          );
        })}
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

  card: {
    backgroundColor: cardBg,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    position: 'relative',
  },
  removeIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: textPrimary,
    marginBottom: 8,
  },

  inputRow: {
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 14,
    color: textPrimary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    textAlign: 'right',
    backgroundColor: '#fff',
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

  resultCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: cardBg,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
  },
  resultTextRow: {
    marginLeft: 10,
  },
  resultLabel: {
    fontSize: 16,
    color: textPrimary,
    fontWeight: '600',
  },
  resultValue: {
    fontSize: 16,
    color: textSecondary,
    marginTop: 2,
  },
});

export default MedicalIndicatorsScreen;