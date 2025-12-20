// components/ResultCard.jsx
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const textPrimary = '#004D40';
const textSecondary = '#00695C';
const cardBg = '#ffffff';

const ResultCard = ({ label, status }) => 
{
  const isHigh = status.includes('High') || status.includes('❌');
  const isLow = status.includes('Low' || 'Less');

    let icon;
    let color;

    if (isHigh) {
        icon = 'close-circle';
        color = '#F44336';
    } 
    else if (isLow) {
        icon = 'warning';
        color = '#FFC107';
    } 
    else {
        icon = 'checkmark-circle';
        color = '#4CAF50';
    }

  return (
    <View style={styles.resultCard}>

      <Ionicons name={icon} size={24} color={color} />
      
      <View style={styles.resultTextRow}>
        <Text style={styles.resultLabel}>{label}</Text>
        <Text style={styles.resultValue}>{status}</Text>
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
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

export default ResultCard;
