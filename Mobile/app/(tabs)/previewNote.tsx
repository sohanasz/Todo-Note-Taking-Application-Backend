import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { createPreviewNoteStyles } from "@/assets/styles/previewNote";
import useTheme from "@/hooks/useTheme";
import { useNote } from "@/hooks/useNote";
import SafeScreen from "@/components/SafeScreen";
import Markdown from "react-native-markdown-display";

const PreviewNote = () => {
  const { colors } = useTheme();
  const styles = createPreviewNoteStyles(colors);
  const { note } = useNote();

  // const { title, content } = useLocalSearchParams<{
  //   title?: string;
  //   content?: string;
  // }>();

  const { title, content } = note;

  return (
    <SafeScreen style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{title || "Untitled"}</Text>

        <Markdown
          style={{
            body: { color: colors.text },
            heading1: { color: colors.text },
            heading2: { color: colors.text },
            paragraph: { color: colors.text },
            bullet_list: { color: colors.text },
            ordered_list: { color: colors.text },
            code_block: {
              backgroundColor: colors.surface,
              color: colors.text,
            },
          }}
        >
          {content || ""}
        </Markdown>
      </ScrollView>
    </SafeScreen>
  );
};

export default PreviewNote;
