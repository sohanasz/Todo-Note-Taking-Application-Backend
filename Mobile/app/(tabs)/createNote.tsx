import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import useTheme from "@/hooks/useTheme";
import useProject from "@/hooks/useProject";
import { api } from "@/lib/api";
import { useNote } from "@/hooks/useNote";
import TextEditor from "@/components/TextEditor";
import { NotesPreviewer } from "@/components/NotesPreviewer";

const CreateNote = () => {
  const { colors } = useTheme();
  const { project } = useProject();
  const { note, setNote } = useNote();
  const [content, setContent] = useState("");

  const handlePreview = () => {
    setNote({ title, content });
    router.push({
      pathname: "/previewNote",
      params: { title, content },
    });
  };

  const handleSave = async () => {
    if (!project?._id) {
      Alert.alert(
        "Notes did not save!",
        "Please select a project before saving...."
      );
      return;
    }

    try {
      setNote({ title, content });
      await api.post(`/projects/${project._id}/notes`, {
        title,
        content,
      });
      router.back();
    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
    }
  };

  return (
    <>
      <TextEditor onSave={handleSave} setNotes={setNote} colors={colors} />
      {/* <NotesPreviewer /> */}
    </>
  );
};

export default CreateNote;
