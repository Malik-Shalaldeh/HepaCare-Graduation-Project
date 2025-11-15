// Theme definition for shared styling across the HepaCare app.
// Import these tokens (e.g. `import theme from "../style/theme"`) and reference
// theme.colors.*, theme.spacing.*, etc. to ensure consistent UI.
// طريقة الاستخدام:
// 1. استدعِ الملف في أي مكون عبر: import theme from "../style/theme";
// 2. استخدم التوكنات بهذا الشكل: theme.colors.primary أو theme.spacing.md لتضمن مظهراً متناسقاً.

const colors = {
  primary: "#0B4F6C", // اللون اللي بنستخدمه للأزرار والشريط الرئيسي
  secondary: "#12344C", // درجة أغمق للعناوين أو الخلفيات البارزة
  accent: "#2FA4A9", // لمسة لونية للأزرار الثانوية أو الأيقونات
  success: "#1FA37A", // للرسائل الإيجابية أو الحالات الناجحة
  warning: "#E89F3C", // تنبيهات خفيفة أو حالات تحتاج انتباه
  danger: "#D3505A", // أخطاء أو حالات خطيرة لازم تنتبه لها
  info: "#3F8EDB", // معلومات إضافية أو روابط مساعدة
  backgroundLight: "#F2F6F8", // خلفية الصفحات الخفيفة أو أقسام البطاقات
  background: "#FFFFFF", // الخلفية الأساسية اللي بنبني عليها
  textPrimary: "#0D1E2E", // النصوص الأساسية اللي نقرأها كتير
  textSecondary: "#4A647A", // نصوص فرعية أو ملاحظات جانبية
  textMuted: "#8CA0B3", // نص خافت للأشياء الأقل أهمية
  border: "#D4DFE6", // حدود البطاقات والفواصل الهادية
  overlay: "rgba(13, 30, 46, 0.32)", // ظل خفيف وقت المودال أو اللوحات
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 999,
};

const typography = {
  fontFamily: "Cairo, System",
  headingLg: 28,
  headingMd: 22,
  headingSm: 18,
  bodyLg: 16,
  bodyMd: 14,
  bodySm: 12,
  lineHeightTight: 20,
  lineHeightNormal: 24,
  lineHeightRelaxed: 28,
};

const shadows = {
  light: {
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  medium: {
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
};

const theme = {
  colors,
  spacing,
  radii,
  typography,
  shadows,
};

export default theme;
export { colors, spacing, radii, typography, shadows };
