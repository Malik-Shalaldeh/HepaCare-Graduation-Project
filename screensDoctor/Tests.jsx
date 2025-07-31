import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';

const Tests = () => {
  const navigation = useNavigation();
  return (
    <ScreenWithDrawer title={"الفحوصات"}>
      {/* زر الرجوع */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} >
        <Ionicons name='arrow-back' size={24} color={"#000"} />
      </TouchableOpacity>

      {/* زر ادخال نتائج الفحوصات */}
      <TouchableOpacity
        style={[styles.testButton, styles.entryButton]}
        onPress={() => navigation.navigate('InputTestResultScreen')}
      >
        <View style={styles.testButtonContent}>
          <Ionicons name="create-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.testButtonText}>ادخال نتائج الفحوصات</Text>
        </View>
      </TouchableOpacity>

      {/* زر نتائج الفحوصات */}
      <TouchableOpacity style={styles.testButton} onPress={() => navigation.navigate('TestResultsScreen')}>
        <View style={styles.testButtonContent}>
          <Ionicons name="document-text-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.testButtonText}>نتائج فحوصات المرضى</Text>
        </View>
      </TouchableOpacity>

      {/* زر حساب القيم الطبية */}
      <TouchableOpacity
        style={[styles.testButton, styles.indicatorsButton]}
        onPress={() => navigation.navigate('MedicalIndicatorsScreen')}
      >
        <View style={styles.testButtonContent}>
          <Ionicons name="medkit-outline" size={24} color="#fff" style={styles.icon} />
          <Text style={styles.testButtonText}>حساب القيم الطبية</Text>
        </View>
      </TouchableOpacity>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
  },
  testButton: {
    backgroundColor: '#2E3192',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  entryButton: {
    backgroundColor: '#16A085',  // لون أخضر لإبراز الإدخال
  },
  indicatorsButton: {
    backgroundColor: '#8532A8',  // أرجواني للحساب الطبي
  },
  testButtonContent: {
    flexDirection: 'row-reverse', // لأن النص بالعربي
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 10,
  },
});

export default Tests;
