import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// اللون الأساسي
const primary = '#2C3E50';
const accent = '#2980B9';
const textColor = '#34495E';
const background = '#ecf0f1';

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={primary} barStyle="light-content" />

        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
    

      {/* المحتوى */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>مقدمة</Text>
        <Text style={styles.text}>نحن نأخذ خصوصيتك على محمل الجد. تم تصميم هذا التطبيق لمساعدة مرضى التهاب الكبد الوبائي، ونلتزم بحماية معلوماتك الشخصية.</Text>

        <Text style={styles.sectionTitle}>المعلومات التي نجمعها</Text>
        <Text style={styles.text}>قد نقوم بجمع معلومات شخصية مثل الاسم، البريد الإلكتروني، والتاريخ الطبي لتحسين الخدمة المقدمة.</Text>

        <Text style={styles.sectionTitle}>كيفية استخدام المعلومات</Text>
        <Text style={styles.text}>تُستخدم المعلومات لتقديم الرعاية الصحية، وتحليل البيانات الطبية، وتحسين جودة التطبيق.</Text>

        <Text style={styles.sectionTitle}>مشاركة البيانات</Text>
        <Text style={styles.text}>لا نشارك معلوماتك مع أي طرف ثالث بدون موافقتك، إلا في حال وجود التزام قانوني.</Text>

        <Text style={styles.sectionTitle}>أمان المعلومات</Text>
        <Text style={styles.text}>نستخدم تقنيات حديثة لحماية بياناتك، ونعمل على تحديث أنظمة الأمان باستمرار.</Text>

        <Text style={styles.sectionTitle}>التعديلات</Text>
        <Text style={styles.text}>قد نقوم بتعديل سياسة الخصوصية من وقت لآخر، وسيتم إعلامك بأي تغيير من خلال التطبيق.</Text>

        <View style={{ height: Platform.OS === 'android' ? 30 : 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: background,
  },
 
  backButton: {
    margin: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: Platform.OS === 'android' ? 40 : 20,
    backgroundColor: background,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: accent,
    marginTop: 20,
    marginBottom: 8,
    textAlign: 'right',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: textColor,
    textAlign: 'right',
  },
});

export default PrivacyPolicyScreen;
