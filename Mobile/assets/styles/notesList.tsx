import { StyleSheet } from "react-native";
import { ColorScheme } from "@/hooks/useTheme";

export const createNotesStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      paddingHorizontal: 16,
    },

    title: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
      marginTop: 22,
      textAlign: "center",
    },

    listContent: {
      paddingBottom: 140,
      paddingHorizontal: 4, // ✅ prevents shadow clipping
    },

    row: {
      justifyContent: "space-between",
      marginBottom: 12,
    },

    noteCard: {
      width: "48%",
      minHeight: 160,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 14,

      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 5,
    },

    noteTitle: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 6,
    },

    noteContent: {
      fontSize: 14,
      color: colors.textMuted,
      lineHeight: 20,
      marginBottom: 10,
    },

    metaRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: "auto",
    },

    metaText: {
      fontSize: 12,
      fontWeight: 700,
      color: colors.textMuted,
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

    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.bg,
    },

    mutedText: {
      color: colors.textMuted,
    },
  });
