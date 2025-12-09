import { StyleSheet } from "react-native";
import theme from "../style/theme";

export default StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
    alignItems: "center",
  },

  label: {
    fontSize: theme.typography.bodyMd,
    fontWeight: "700",
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    color: theme.colors.textPrimary,
    alignSelf: "flex-end",
    width: "100%",
    maxWidth: 480,
    fontFamily: theme.typography.fontFamily,
  },

  rolesRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    marginBottom: theme.spacing.md,
    width: "100%",
    maxWidth: 480,
    justifyContent: "flex-end",
  },

  roleBtn: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm + 4,
    margin: theme.spacing.xs / 2,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.background,
  },

  roleBtnActive: {
    backgroundColor: theme.colors.buttonPrimary,
    borderColor: theme.colors.buttonPrimary,
  },

  roleText: {
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySm,
    fontFamily: theme.typography.fontFamily,
  },

  roleTextActive: {
    color: theme.colors.buttonPrimaryText,
  },

  searchBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.xl,
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    width: "100%",
    maxWidth: 480,
  },

  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.bodySm,
    color: theme.colors.textPrimary,
    fontFamily: theme.typography.fontFamily,
    textAlign: "right",
  },

  searchIcon: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    justifyContent: "center",
    alignItems: "center",
  },

  resultItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    width: "100%",
    maxWidth: 480,
    backgroundColor: theme.colors.background,
  },

  resultText: {
    textAlign: "right",
    color: theme.colors.textPrimary,
    fontSize: theme.typography.bodySm,
    fontFamily: theme.typography.fontFamily,
  },

  userCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    width: "100%",
    maxWidth: 480,
    ...theme.shadows.light,
  },

  userName: {
    fontSize: theme.typography.bodyLg,
    fontWeight: "800",
    marginBottom: theme.spacing.xs,
    textAlign: "right",
    color: theme.colors.textPrimary,
  },

  userMeta: {
    fontSize: theme.typography.bodySm,
    color: theme.colors.textSecondary,
    textAlign: "right",
    fontFamily: theme.typography.fontFamily,
  },

  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radii.lg,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    fontSize: theme.typography.bodySm,
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.backgroundLight,
    width: "100%",
    maxWidth: 480,
    textAlign: "right",
  },

  updateBtn: {
    backgroundColor: theme.colors.buttonPrimary,
    paddingVertical: theme.spacing.md,
    borderRadius: 999,
    alignItems: "center",
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    width: "100%",
    maxWidth: 260,
    ...theme.shadows.light,
  },

  updateText: {
    color: theme.colors.buttonPrimaryText,
    fontWeight: "700",
    fontSize: theme.typography.bodyMd,
  },
});
