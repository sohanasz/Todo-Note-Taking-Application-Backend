import { StyleSheet } from "react-native";
import { ColorScheme } from "@/hooks/useTheme";

export const createCreateProjectStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 16,
    },

    title: {
      fontSize: 26,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 20,
      textAlign: "center",
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 20,
      marginBottom: 24,

      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 6,
    },

    field: {
      marginBottom: 16,
    },

    label: {
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
      marginBottom: 6,
    },

    input: {
      backgroundColor: colors.backgrounds.input,
      borderRadius: 12,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },

    textArea: {
      minHeight: 100,
      textAlignVertical: "top",
    },

    button: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      borderRadius: 16,
      alignItems: "center",

      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
    },

    buttonText: {
      color: colors.surface,
      fontSize: 16,
      fontWeight: "700",
    },
  });
