// components/TestCard.jsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AVAILABLE_TESTS } from '../componentDoctor/availableTestsindicators';

const textPrimary = '#004D40';

const InputRow = ({ label, value, onChange }) => (
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

const TestCard = ({ testKey, values, onChangeValue, onRemove }) => 
  {
  const testInfo = AVAILABLE_TESTS.find(t => t.key === testKey);

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.removeIcon} onPress={onRemove}>
        <Ionicons name="close-circle" size={35} color="#F44336" />
      </TouchableOpacity>

      <Text style={styles.cardTitle}>{testInfo?.label || testKey}</Text>

      {testKey === 'FIB4' && (
        <>
          <InputRow label="Age (yrs)" value={values.FIB4_age} onChange={v => onChangeValue('FIB4_age', v)} />
          <InputRow label="AST (U/L)" value={values.FIB4_ast} onChange={v => onChangeValue('FIB4_ast', v)} />
          <InputRow label="ALT (U/L)" value={values.FIB4_alt} onChange={v => onChangeValue('FIB4_alt', v)} />
          <InputRow label="Platelets" value={values.FIB4_platelets} onChange={v => onChangeValue('FIB4_platelets', v)} />
        </>
      )}

      {testKey === 'APRI' && (
        <>
          <InputRow label="AST (U/L)" value={values.APRI_ast} onChange={v => onChangeValue('APRI_ast', v)} />
          <InputRow label="AST ULN" value={values.APRI_uln} onChange={v => onChangeValue('APRI_uln', v)} />
          <InputRow label="Platelets" value={values.APRI_platelets} onChange={v => onChangeValue('APRI_platelets', v)} />
        </>
      )}

      {['ALT','AST','Bilirubin','INR','Platelets'].includes(testKey) && (
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter value"
          value={values[testKey]}
          onChangeText={t => onChangeValue(testKey, t)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    textAlign: 'right',
  },
});

export default TestCard;
