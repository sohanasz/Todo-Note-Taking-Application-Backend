import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useEffect, useState } from "react";
import { router } from "expo-router";
import useTheme from "@/hooks/useTheme";
import useProject from "@/hooks/useProject";
import { api } from "@/lib/api";
import { useNote } from "@/hooks/useNote";
import TextEditor from "@/components/TextEditor";

const CreateNote = () => {
  const { colors } = useTheme();
  const { project } = useProject();
  const { note, setNote, noteTitle, setNoteTitle, updateNoteCB, noteId } =
    useNote();

  const handleSave = async () => {
    if (!project._id) {
      Alert.alert(
        "Notes did not save!",
        "Please select a project before saving...."
      );
      return;
    }

    try {
      await api.post(`/projects/${project._id}/notes`, {
        title: noteTitle,
        content: note,
      });
    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
    }
  };

  const handleUpdate = async () => {
    if (!project._id) {
      Alert.alert(
        "Notes did not update!",
        "Please select a project before saving...."
      );
      return;
    }

    try {
      const res = await api.put(`/projects/${project._id}/notes/${noteId}`, {
        title: noteTitle,
        content: note,
      });

      if (res.status === 200) {
        Alert.alert("Success", "Notes updated successfully");
      }
    } catch (err) {
      Alert.alert("Something went wrong", "Notes did not update!");
      console.error("Failed to update note", err);
    } finally {
    }
  };

  return (
    <>
      <TextEditor
        onSave={updateNoteCB ? handleUpdate : handleSave}
        notesTitle={noteTitle}
        setNotesTitle={setNoteTitle}
        notes={note}
        setNotes={setNote}
        colors={colors}
      />
    </>
  );
};

export default CreateNote;
