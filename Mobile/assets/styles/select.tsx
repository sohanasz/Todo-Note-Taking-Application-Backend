import { StyleSheet } from "react-native";
import { ColorScheme } from "@/theme/colors";

export const createProjectHomeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: colors.bg,
      alignContent: "center",
      justifyContent: "center",
    },

    title: {
      fontSize: 26,
      fontWeight: "700",
      marginBottom: 24,
      textAlign: "center",
      color: colors.text,
    },

    card: {
      minHeight: 120,
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
      justifyContent: "center",

      backgroundColor: colors.surface,
      borderWidth: 1.5,
      borderColor: colors.primary,

      // iOS shadow
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 10,

      // Android
      elevation: 6,
    },

    cardTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 6,
      color: colors.text,
    },

    cardSubtitle: {
      fontSize: 14,
      color: colors.textMuted,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bg,
    },

    emptyText: {
      color: colors.textMuted,
      fontSize: 14,
    },
  });
