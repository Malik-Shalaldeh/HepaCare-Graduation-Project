//sami
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenWithDrawer from "../screensDoctor/ScreenWithDrawer";
import {
  colors,
  spacing,
  radii,
  typography,
  shadows,
} from "../style/theme";

const LIBRARY_CONTENT = [
  {
    id: 1,
    type: "مقال",
    title: "ما هو التهاب الكبد الوبائي B؟",
    content:
      "التهاب الكبد الوبائي B هو عدوى فيروسية تصيب الكبد، يسببها فيروس التهاب الكبد (HBV) B. يمكن أن تكون العدوى حادة (قصيرة الأمد) أو مزمنة (طويلة الأمد)، وقد تؤدي إلى مضاعفات خطيرة مثل تليف الكبد وسرطان الكبد.",
  },
  {
    id: 2,
    type: "مقال",
    title: "كيف ينتقل فيروس التهاب الكبد B؟",
    content:
      "ينتقل الفيروس عبر ملامسة سوائل الجسم المصابة، ويشمل ذلك:\n\n• من الأم إلى الطفل عند الولادة: تُعتبر هذه الطريقة الأكثر شيوعاً لانتقال العدوى عالمياً.\n\n• التعرض للدم الملوث: مثل مشاركة الإبر أو الأدوات الحادة الملوثة.\n\n• الاتصال الجنسي غير المحمي: مع شخص مصاب.\n\n• مشاركة الأدوات الشخصية: مثل شفرات الحلاقة أو فرش الأسنان مع شخص مصاب.",
  },
  {
    id: 3,
    type: "مقال",
    title: "ما هي أعراض التهاب الكبد الوبائي B؟",
    content:
      "قد لا تظهر أي أعراض على المصابين، خاصة في المراحل المبكرة. عندما تظهر الأعراض، قد تشمل:\n\n• التعب الشديد\n\n• آلام في البطن\n\n• فقدان الشهية\n\n• غثيان وقيء\n\n• اصفرار الجلد والعينين (اليرقان)\n\n• بول داكن اللون\n\n• براز فاتح اللون\n\nتظهر الأعراض عادة بعد نحو 1-6 أشهر من الإصابة بالعدوى.",
  },
  {
    id: 4,
    type: "مقال",
    title: "كيف يتم تشخيص التهاب الكبد الوبائي B؟",
    content:
      "يتم التشخيص من خلال:\n\n• فحوصات الدم: لتحديد وجود الفيروس أو الأجسام المضادة له.\n\n• اختبارات وظائف الكبد: لقياس مدى تأثير الفيروس على الكبد.\n\n• خزعة الكبد: في بعض الحالات، قد يتم أخذ عينة من نسيج الكبد لفحصها.",
  },
  {
    id: 5,
    type: "مقال",
    title: "ما هو علاج التهاب الكبد الوبائي B؟",
    content:
      "يعتمد العلاج على نوع العدوى:\n\n• العدوى الحادة: يُنصح بالراحة والتغذية السليمة. غالباً ما يتعافى المريض تلقائياً دون علاج خاص.\n\n• العدوى المزمنة: قد يتطلب العلاج بأدوية مضادة للفيروسات للحد من تكاثر الفيروس وتقليل تلف الكبد.\n\n• حالات متقدمة: في حالة تليف الكبد أو فشل الكبد، قد تكون زراعة الكبد ضرورية.",
  },
  {
    id: 6,
    type: "مقال",
    title: "كيف يمكن الوقاية من التهاب الكبد الوبائي B؟",
    content:
      "تشمل التدابير الوقائية:\n\n• التطعيم: يُعتبر اللقاح آمناً وفعالاً ويوفر حماية طويلة الأمد.\n\n• ممارسات جنسية آمنة: استخدام الواقيات الذكرية يقلل من خطر الانتقال الجنسي.\n\n• تجنب مشاركة الأدوات الشخصية: مثل شفرات الحلاقة وفرش الأسنان.\n\n• ممارسات طبية آمنة: التأكد من استخدام إبر وأدوات معقمة في الإجراءات الطبية والتجميلية.\n\n• فحص النساء الحوامل: لمنع انتقال الفيروس إلى المولود.",
  },
  {
    id: 7,
    type: "مقال",
    title: "ما هو وضع التهاب الكبد الوبائي B في فلسطين؟",
    content:
      "أعلنت وزارة الصحة الفلسطينية أنه لم تُسجل أي إصابة بالتهاب الكبد الوبائي B بين المواليد منذ عام 1992، مما يشير إلى فعالية برامج التطعيم الوطنية.",
  },
  {
    id: 8,
    type: "مقال",
    title: "ما هي إحصاءات الإصابة بالتهاب الكبد الوبائي B في فلسطين؟",
    content:
      "وفقاً للجهاز المركزي للإحصاء الفلسطيني، بلغ عدد الإصابات بالتهاب الكبد الوبائي B لكل 100,000 شخص في فلسطين 0.280 في عام 2022.",
  },
];

const FAQ_CONTENT = [
  {
    id: 1,
    question: "هل يمكن الشفاء التام من التهاب الكبد الوبائي B؟",
    answer:
      "يمكن للبالغين الأصحاء التخلص من الفيروس بشكل كامل في حالات العدوى الحادة. ومع ذلك، قد تصبح العدوى مزمنة لدى بعض الأشخاص، مما يتطلب متابعة طبية مستمرة.",
  },
  {
    id: 2,
    question: "هل يمكن أن أعيش حياة طبيعية مع التهاب الكبد الوبائي B؟",
    answer:
      "نعم، مع الالتزام بالعلاج والمتابعة الطبية، يمكن للمصابين العيش بشكل طبيعي وتجنب المضاعفات.",
  },
  {
    id: 3,
    question: "هل يمكن أن أنقل العدوى لأفراد عائلتي؟",
    answer:
      "يمكن ذلك إذا لم يحصلوا على اللقاح أو لم يتخذوا تدابير الوقاية. لا ينتقل الفيروس عبر المصافحة أو مشاركة الطعام.",
  },
  {
    id: 4,
    question: "هل يؤثر المرض على الحمل؟",
    answer:
      "يمكن أن ينتقل الفيروس من الأم إلى الطفل أثناء الولادة. ومع ذلك، يمكن منع ذلك بإعطاء الطفل اللقاح والمناعة الفورية بعد الولادة.",
  },
  {
    id: 5,
    question: "ما هي نصائح الحفاظ على صحة الكبد؟",
    answer:
      "• تجنب التدخين\n\n• اتباع نظام غذائي صحي\n\n• ممارسة الرياضة\n\n• إجراء فحوصات دورية",
  },
];

const getTypeIcon = (type) => {
  switch (type) {
    case "مقال":
      return "document-text";
    case "فيديو":
      return "play-circle";
    case "صورة":
      return "image";
    default:
      return "document-text";
  }
};

const EducationalContentScreen = () => {
  return (
    <ScreenWithDrawer>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Ionicons name="library" size={22} color={colors.primary} />
              <Text style={styles.sectionHeader}>
                معلومات عن التهاب الكبد الوبائي B
              </Text>
            </View>

            {LIBRARY_CONTENT.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.iconContainer}>
                    <Ionicons
                      name={getTypeIcon(item.type)}
                      size={18}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                </View>
                <Text style={styles.cardContent}>{item.content}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeaderContainer}>
              <Ionicons name="help-circle" size={22} color={colors.primary} />
              <Text style={styles.sectionHeader}>الأسئلة الشائعة</Text>
            </View>

            {FAQ_CONTENT.map((item) => (
              <View key={item.id} style={styles.card}>
                <View style={styles.questionContainer}>
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={18}
                    color={colors.primary}
                    style={styles.questionIcon}
                  />
                  <Text style={styles.question}>{item.question}</Text>
                </View>
                <Text style={styles.answer}>{item.answer}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ScreenWithDrawer>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  sectionHeaderContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.primary,
  },
  sectionHeader: {
    fontSize: typography.headingSm,
    fontWeight: "700",
    color: colors.primary,
    marginRight: spacing.sm,
  },
  card: {
    backgroundColor: colors.background,
    marginVertical: spacing.sm,
    borderRadius: radii.lg,
    padding: spacing.xl,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    ...shadows.medium,
  },
  cardHeader: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  iconContainer: {
    backgroundColor: `${colors.primary}15`,
    padding: spacing.sm,
    borderRadius: radii.md,
    marginLeft: spacing.sm,
    marginRight: spacing.xs,
  },
  cardTitle: {
    fontSize: typography.bodyLg,
    fontWeight: "600",
    color: colors.primary,
    flex: 1,
    lineHeight: typography.lineHeightNormal,
    textAlign: "right",
    writingDirection: "rtl",
  },
  cardContent: {
    fontSize: typography.bodyMd,
    color: colors.textPrimary,
    lineHeight: typography.lineHeightNormal,
    textAlign: "right",
    writingDirection: "rtl",
  },
  questionContainer: {
    flexDirection: "row-reverse",
    alignItems: "flex-start",
    marginBottom: spacing.sm,
  },
  questionIcon: {
    marginRight: spacing.sm,
    marginTop: 2,
  },
  question: {
    fontSize: typography.bodyLg,
    fontWeight: "600",
    color: colors.primary,
    flex: 1,
    lineHeight: typography.lineHeightNormal,
    textAlign: "right",
    writingDirection: "rtl",
  },
  answer: {
    fontSize: typography.bodyMd,
    color: colors.textSecondary,
    lineHeight: typography.lineHeightNormal,
    textAlign: "right",
    writingDirection: "rtl",
    paddingRight: spacing.xl,
  },
});

export default EducationalContentScreen;
