import { ColorScheme } from "@/hooks/useTheme";
import { StyleSheet } from "react-native";

export const createSettingsStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    sectionTitle: {
      fontSize: 25,
      fontWeight: "700",
      color: "#1A1A1A",
      marginBottom: 10,
      marginTop: 12,
      textAlign: "center",
    },
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 16,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: 18,
      paddingVertical: 16,
      paddingHorizontal: 18,

      // iOS shadow
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.08,
      shadowRadius: 10,

      // Android
      elevation: 6,
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
      fontWeight: "600",
      color: colors.text,
    },

    helperText: {
      marginTop: 10,
      fontSize: 13,
      color: colors.textMuted,
    },
  });
  return styles;
};
