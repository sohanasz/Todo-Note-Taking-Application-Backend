import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { createPreviewNoteStyles } from "@/assets/styles/previewNote";
import useTheme from "@/hooks/useTheme";
import { useNote } from "@/hooks/useNote";
import { NotesPreviewer } from "@/components/NotesPreviewer";

const PreviewNote = () => {
  const { colors } = useTheme();
  const styles = createPreviewNoteStyles(colors);
  const { note } = useNote();

  return <NotesPreviewer note={note} colors></NotesPreviewer>;
};

export default PreviewNote;
