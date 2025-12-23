import { StyleSheet } from "react-native";
import { ColorScheme } from "@/hooks/useTheme";

export const createCreateNoteStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
      padding: 16,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "600",
      color: colors.text,
    },
    previewBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    previewText: {
      color: colors.primary,
      fontWeight: "500",
    },
    titleInput: {
      backgroundColor: colors.backgrounds.input,
      color: colors.text,
      fontSize: 18,
      padding: 14,
      borderRadius: 10,
      marginBottom: 12,
    },
    editor: {
      flex: 1,
      backgroundColor: colors.backgrounds.input,
      color: colors.text,
      padding: 16,
      borderRadius: 12,
      fontSize: 15,
    },
    saveBtn: {
      backgroundColor: colors.primary,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 12,
    },
    saveText: {
      color: colors.surface,
      fontWeight: "600",
      fontSize: 16,
    },
    disabled: {
      opacity: 0.6,
    },
  });
