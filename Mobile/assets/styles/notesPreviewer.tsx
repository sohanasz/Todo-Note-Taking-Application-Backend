import { StyleSheet } from "react-native";
import { ColorScheme } from "@/hooks/useTheme";

export const createNotesPreviewStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    body: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },

    heading1: {
      color: colors.text,
      fontSize: 26,
      fontWeight: "700",
      lineHeight: 34,
      marginBottom: 12,
      marginTop: 4,
      includeFontPadding: false,
    },

    heading2: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "600",
      lineHeight: 30,
      marginBottom: 10,
      marginTop: 4,
      includeFontPadding: false,
    },

    heading3: {
      color: colors.text,
      fontSize: 18,
      fontWeight: "600",
      lineHeight: 25,
      marginBottom: 8,
      marginTop: 4,
      includeFontPadding: false,
    },

    paragraph: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 12,
      includeFontPadding: false,
    },

    bullet_list: {
      marginBottom: 12,
    },

    ordered_list: {
      marginBottom: 12,
    },

    list_item: {
      flexDirection: "row",
      marginBottom: 6,
    },

    bullet_list_icon: {
      color: colors.text,
      marginRight: 8,
    },

    ordered_list_icon: {
      color: colors.text,
      marginRight: 8,
    },

    list_item_text: {
      color: colors.text,
      fontSize: 15,
      lineHeight: 22,
    },

    strong: {
      fontWeight: "700",
      color: colors.text,
    },

    em: {
      fontStyle: "italic",
      color: colors.text,
    },

    code_block: {
      backgroundColor: colors.surface,
      color: colors.text,
      padding: 12,
      borderRadius: 8,
      fontSize: 14,
      marginVertical: 8,
    },

    inline_code: {
      backgroundColor: colors.surface,
      color: colors.primary,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      fontSize: 14,
    },

    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: colors.border,
      paddingLeft: 12,
      color: colors.textMuted,
      marginVertical: 10,
    },
  });
