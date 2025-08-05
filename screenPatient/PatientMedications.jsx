import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';

const PatientMedications = ({ navigation }) => {
  return (
    <ScreenWithDrawer>

      {/* ✅ زر "الأدوية التي أتناولها" */}
      <TouchableOpacity
        style={styles.Button}
        onPress={() => navigation.navigate('الأدوية التي أتناولها')}
      >
        <View style={styles.ButtonContent}>
          <Ionicons name="medkit-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.ButtonText}>الأدوية التي أتناولها</Text>
        </View>
      </TouchableOpacity>

      {/* ✅ زر "الأدوية المتوفرة في وزارة الصحة" */}
      <TouchableOpacity
      style={{...styles.Button,backgroundColor:'#00796B'}}
        onPress={() => navigation.navigate('الأدوية المتوفرة في الصحة')}
      >
        <View style={styles.ButtonContent}>
          <Ionicons name="list-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.ButtonText}>الأدوية المتوفرة في الصحة</Text>
        </View>
      </TouchableOpacity>

    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#00b29c',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  menuButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 28, // لتعويض الأيقونة من جهة اليمين
  },
  Button: {
    backgroundColor: '#90A4AE',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    margin: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  ButtonContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
});

export default PatientMedications;
