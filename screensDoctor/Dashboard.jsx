import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import { useNavigation } from '@react-navigation/native';

const primary = '#2C3E50';
const accent = '#2980B9';
const textColor = '#34495E';

const {width} = Dimensions.get('window');

const Dashboard = () => {
  const navigation = useNavigation();
  const patientsCount = 42;
  const today = new Date();
  const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو','يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (    
    <ScreenWithDrawer title="لوحة التحكم" /* محتوى الشاشة */>

      {/* ✅ Header with Hepacare name */}
      <View style={styles.header}>
      <Text style={styles.headerText}>Hepacare</Text>
      </View>

      <View style={styles.container}>

        {/* ✅ بطاقة الترحيب */}
        <View style={styles.card}>
          <Ionicons name="person-circle-outline" size={40} color={accent} style={styles.icon} />
          <View>
            <Text style={styles.title}>مرحباً د. علي 👨‍⚕️</Text>
            <Text style={styles.subtitle}>{formattedDate}</Text>
          </View>
        </View>

        {/* ✅ بطاقة عدد المرضى بنفس ستايل الترحيب */}
        <View style={styles.card}>
          <Ionicons name="people-outline" size={40} color={accent} style={styles.icon} />
          <View>
            <Text style={styles.title}>{patientsCount} مريض</Text>
            <Text style={styles.subtitle}>عدد المرضى  </Text>
          </View>
        </View>

      </View>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 60,
    backgroundColor: '#F8FAFB',
    alignItems: 'center',
  },

  card: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  icon: {
    marginEnd: 12,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: primary,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: textColor,
  },
header: {
  width: '100%',
  backgroundColor: accent,
  paddingVertical: 20,
  paddingHorizontal: 24,
  borderRadius: 16,
  marginBottom: 30,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
  alignItems: 'center',
},

headerText: {
  fontSize: 28,
  fontWeight: 'bold',
  color: '#fff',
  letterSpacing: 3,
},

});

export default Dashboard;