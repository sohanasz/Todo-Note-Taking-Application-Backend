import { StyleSheet } from "react-native";
import { ColorScheme } from "@/hooks/useTheme";

export const createPreviewNoteStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 16,
    },
  });
