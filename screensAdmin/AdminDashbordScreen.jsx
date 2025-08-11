// screensAdmin/AdminHome.tsx
import { View, Text, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const primary = '#00b29c';
const text    = '#2C3E50';
const subtle  = '#6B7280';
const bg      = '#F8FAFB';

export default function AdminHome() {

  const today = new Date();
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const date = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

  return (
    <SafeAreaView style={styles.page}>
      <StatusBar backgroundColor={primary} barStyle="dark-content" />

      {/* كارد شعار التطبيق + التاريخ */}
      <View style={styles.logoCard}>
        <Text style={styles.logoText}>HepaCare</Text>
        <Text style={styles.logoDate}>{date}</Text>
      </View>

      {/*كارد ترحيب */}
      <View style={styles.welcomeCard}>
        <View style={styles.textBox}>
          <Text style={styles.welcomeTitle}>مرحباً أيها المدير 👋</Text>
          <Text style={styles.adminSubtitle}>لوحة القيادة بين يديك، كل شيء تحت سيطرتك!</Text>
        </View>
        <Ionicons
          name="person-circle-outline"
          size={44}
          color={primary}
          style={styles.iconLeft}
        />
      </View>

      {/* كارد يوضّح الصلاحيات */}
      <View style={styles.adminCard}>
        <View style={styles.textBox}>
          <Text style={styles.adminTitle}>صلاحيات كاملة</Text>
          <Text style={styles.adminSubtitle}>يمكنك إدارة النظام بالكامل والتحكم بالسجلات</Text>
        </View>
        <Ionicons
          name="shield-checkmark-outline"
          size={44}
          color={primary}
          style={styles.iconLeft}
        />
      </View>
          </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: bg,
    paddingTop: (StatusBar.currentHeight || 0) + 10,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  logoCard: {
    backgroundColor: primary,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 30,
    ...Platform.select({
      android: { elevation: 6 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  
  logoText: { 
    fontSize: 24, 
    fontWeight: '800', 
    color: '#fff', 
    letterSpacing: 1.5 
  },

  logoDate: { 
    fontSize: 13, 
    color: '#E8FFF8', 
    marginTop: 4 },

  textBox: { 
    flex: 1, 
    alignItems: 'flex-end' 
  },

  welcomeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 50,
    flexDirection: 'row-reverse', // النص يمين / الأيقونة يسار
    alignItems: 'center',
    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  welcomeTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: text, 
    textAlign: 'right' 
  },

  adminCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginTop: 16,
    flexDirection: 'row-reverse',
    alignItems: 'center',

    ...Platform.select({
      android: { elevation: 2 },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  adminTitle: 
  { fontSize: 18,
    fontWeight: '700', 
    color: text, 
    marginBottom: 4, 
    textAlign: 'right' 
  },

  adminSubtitle: { 
    fontSize: 14, 
    color: subtle, 
    textAlign: 'right' 
  },

  iconLeft:
  { 
    marginLeft: 10 
  },
});
