import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWithDrawer from './ScreenWithDrawer';

const primary = '#00b29c';

const POLICY_ITEMS = [
  {
    id: 1,
    title: 'مقدمة',
    content:
      'نحن نأخذ خصوصيتك على محمل الجد. تم تصميم هذا التطبيق لمساعدة مرضى التهاب الكبد الوبائي، ونلتزم بحماية معلوماتك الشخصية.',
  },
  {
    id: 2,
    title: 'المعلومات التي نجمعها',
    content:
      'قد نقوم بجمع معلومات شخصية مثل الاسم، البريد الإلكتروني، والتاريخ الطبي لتحسين الخدمة المقدمة.',
  },
  {
    id: 3,
    title: 'كيفية استخدام المعلومات',
    content:
      'تُستخدم المعلومات لتقديم الرعاية الصحية، وتحليل البيانات الطبية، وتحسين جودة التطبيق.',
  },
  {
    id: 4,
    title: 'مشاركة البيانات',
    content:
      'لا نشارك معلوماتك مع أي طرف ثالث بدون موافقتك، إلا في حال وجود التزام قانوني.',
  },
  {
    id: 5,
    title: 'أمان المعلومات',
    content:
      'نستخدم تقنيات حديثة لحماية بياناتك، ونعمل على تحديث أنظمة الأمان باستمرار.',
  },
  {
    id: 6,
    title: 'التعديلات',
    content:
      'قد نقوم بتعديل سياسة الخصوصية من وقت لآخر، وسيتم إعلامك بأي تغيير من خلال التطبيق.',
  },
];

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <ScreenWithDrawer>
      <SafeAreaView style={styles.safeArea}>
     
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={primary} />
          </TouchableOpacity>

        <ScrollView showsVerticalScrollIndicator={false}>

          {POLICY_ITEMS.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <View style={styles.iconContainer}>
                  <Ionicons name="document-text-outline" size={20} color={primary} />
                </View>
              </View>
              <Text style={styles.cardContent}>{item.content}</Text>
            </View>
          ))}

          <View style={{ height: Platform.OS === 'android' ? 30 : 20 }} />
        </ScrollView>
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  backButton: {
    marginRight: 12,
  },

  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    backgroundColor: `${primary}15`,
    padding: 8,
    borderRadius: 10,
    marginLeft: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: primary,
    flex: 1,
    lineHeight: 22,
    textAlign:'right'
  },
  cardContent: {
    fontSize: 14,
    color: '#222',
    lineHeight: 22,
    textAlign: 'right',
  },
});

export default PrivacyPolicyScreen;
