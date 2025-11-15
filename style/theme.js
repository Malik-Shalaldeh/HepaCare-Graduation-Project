// theme.js حسب مسارك

const colors = {
  primary: "#0B4F6C", // اللون الرئيسي (الهيدر، بعض الأزرار الأساسية)
  secondary: "#12344C", // درجة أغمق للعناوين أو الخلفيات البارزة
  accent: "#2FA4A9", // تركواز بارد للأيقونات أو الهايلايت
  success: "#1FA37A", // يضل للحالات الناجحة (رسائل)، مش للأزرار الأساسية
  warning: "#E89F3C",
  danger: "#D3505A",
  info: "#3F8EDB",

  backgroundLight: "#F2F6F8",
  background: "#FFFFFF",
  textPrimary: "#0D1E2E",
  textSecondary: "#4A647A",
  textMuted: "#8CA0B3",
  border: "#D4DFE6",
  overlay: "rgba(13, 30, 46, 0.32)",

  // 🎨 ألوان الأزرار (كلها قريبة من الأساسي وباردة)
  buttonPrimary: "#0B4F6C",      // زر أساسي غامق (نفس primary)
  buttonPrimaryText: "#FFFFFF",

  buttonSecondary: "#145E80",    // أفتح شوي من الأساسي، أزرق هادي
  buttonSecondaryText: "#FFFFFF",

  buttonInfo: "#1876A6",         // أزرق واضح لزر بحث/تفاصيل
  buttonInfoText: "#FFFFFF",

  buttonSuccess: "#1E6F7E",      // نجاح هادي مائل للتركواز الغامق (لسه بارد)
  buttonSuccessText: "#FFFFFF",

  buttonDanger: "#D3505A",       // يبقى أحمر للتحذير/حذف
  buttonDangerText: "#FFFFFF",

  buttonMuted: "#E1ECF2",        // زر ثانوي هادي
  buttonMutedText: "#0D1E2E",

  buttonOutlineBorder: "#0B4F6C",
  buttonOutlineText: "#0B4F6C",
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
