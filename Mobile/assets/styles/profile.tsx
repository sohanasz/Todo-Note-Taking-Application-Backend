import { StyleSheet } from "react-native";
import { ColorScheme } from "@/hooks/useTheme";

export const createProfileStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 16,
    },

    sectionTitle: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },

    /* Profile Card */
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 16,
      marginBottom: 20,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },

    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      marginRight: 16,
      backgroundColor: colors.border,
    },

    profileInfo: {
      flex: 1,
    },

    name: {
      fontSize: 18,
      fontWeight: "600",
      color: colors.text,
    },

    username: {
      fontSize: 14,
      color: colors.textMuted,
      marginTop: 2,
    },

    /* Settings Card */
    card: {
      backgroundColor: colors.surface,
      padding: 16,
      borderRadius: 16,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },

    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    labelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    label: {
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },

    helperText: {
      marginTop: 8,
      fontSize: 13,
      color: colors.textMuted,
    },
  });
