import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import useTheme from "@/hooks/useTheme";
import useProject from "@/hooks/useProject";
import SafeScreen from "@/components/SafeScreen";
import { api } from "@/lib/api";
import { createCreateNoteStyles } from "@/assets/styles/createNote";
import { Ionicons } from "@expo/vector-icons";
import { useNote } from "@/hooks/useNote";

const CreateNote = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { project } = useProject();
  const styles = createCreateNoteStyles(colors);
  const { note, setNote } = useNote();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePreview = () => {
    setNote({ title, content });
    router.push({
      pathname: "/previewNote",
      params: { title, content },
    });
  };

  const handleSave = async () => {
    if (!project?._id || !content.trim()) return;

    try {
      setIsSaving(true);
      setNote({ title, content });
      await api.post(`/projects/${project._id}/notes`, {
        title,
        content,
      });
      router.back();
    } catch (err) {
      console.error("Failed to create note", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>New Note</Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePreview}
          style={styles.previewBtn}
        >
          <Ionicons name="eye-outline" size={18} color={colors.primary} />
          <Text style={styles.previewText}>Preview</Text>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Title"
        placeholderTextColor={colors.textMuted}
        style={styles.titleInput}
        selectionColor={colors.primary}
      />

      {/* Content */}
      <TextInput
        value={content}
        onChangeText={setContent}
        placeholder="Write your note in Markdown..."
        placeholderTextColor={colors.textMuted}
        style={styles.editor}
        multiline
        textAlignVertical="top"
        selectionColor={colors.primary}
      />

      {/* Save */}
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={handleSave}
        disabled={isSaving}
        style={[styles.saveBtn, isSaving && styles.disabled]}
      >
        <Text style={styles.saveText}>
          {isSaving ? "Saving..." : "Save Note"}
        </Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default CreateNote;
