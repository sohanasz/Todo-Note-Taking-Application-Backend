import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createHomeStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    sectionTitle: {
      fontSize: 25,
      fontWeight: "700",
      color: colors.text,
      // marginBottom: 10,
      marginTop: 22,
      textAlign: "center",
    },

    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },

    listContent: {
      padding: 16,
      paddingBottom: 120,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      padding: 20,
      marginBottom: 16,
      minHeight: 110,
      justifyContent: "center",

      // iOS shadow
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,

      // Android shadow
      elevation: 6,
    },

    projectName: {
      fontSize: 19,
      fontWeight: 700,
      color: colors.text,
    },

    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    metaText: {
      fontSize: 13,
      color: colors.textMuted,
    },

    bold: {
      fontWeight: "700",
      color: colors.text,
    },

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },

    fab: {
      position: "absolute",
      right: 20,
      bottom: 30,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,

      backgroundColor: colors.primary,
      paddingHorizontal: 18,
      paddingVertical: 14,
      borderRadius: 30,

      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 8,
    },

    fabText: {
      color: colors.surface,
      fontSize: 14,
      fontWeight: "600",
    },
  });

  return styles;
};
