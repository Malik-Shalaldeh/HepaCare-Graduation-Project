import React from 'react';
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
import ScreenWithDrawer from '../screensDoctor/ScreenWithDrawer';
import theme from '../style/theme';

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
    <ScreenWithDrawer title="سياسة الخصوصية">
      <SafeAreaView
        style={styles.safeArea}
      >
        {/* زر الرجوع */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme.colors.primary}
          />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {POLICY_ITEMS.map((item) => (
            <View
              key={item.id}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text
                  style={styles.cardTitle}
                >
                  {item.title}
                </Text>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color={theme.colors.primary}
                  />
                </View>
              </View>
              <Text
                style={styles.cardContent}
              >
                {item.content}
              </Text>
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
    backgroundColor: theme.colors.backgroundLight,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  card: {
    backgroundColor: theme.colors.background,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
    borderRadius: theme.radii.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.shadows.light.shadowColor,
    shadowOffset: theme.shadows.light.shadowOffset,
    shadowOpacity: theme.shadows.light.shadowOpacity,
    shadowRadius: theme.shadows.light.shadowRadius,
    elevation: theme.shadows.light.elevation,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  iconContainer: {
    backgroundColor: `${theme.colors.primary}15`,
    padding: theme.spacing.xs,
    borderRadius: theme.radii.sm,
    marginLeft: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.bodyLg,
    fontWeight: '600',
    color: theme.colors.primary,
    flex: 1,
    lineHeight: theme.typography.lineHeightNormal,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
  cardContent: {
    fontSize: theme.typography.bodyMd,
    color: theme.colors.textPrimary,
    lineHeight: theme.typography.lineHeightNormal,
    textAlign: 'right',
    fontFamily: theme.typography.fontFamily,
  },
});

export default PrivacyPolicyScreen;
