import { View, Text, FlatList, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import useProject from "@/hooks/useProject";
import useTheme from "@/hooks/useTheme";
import { api } from "@/lib/api";
import { createNotesStyles } from "@/assets/styles/notesList";
import { Ionicons } from "@expo/vector-icons";
import SafeScreen from "@/components/SafeScreen";
import { router } from "expo-router";
import { useNote } from "@/hooks/useNote";

type Note = {
  _id: string;
  name: string;
  title: string;
  content: string;
  createdBy: {
    username: string;
  };
  createdAt: string;
};

const Notes = () => {
  const { project } = useProject();
  const { colors } = useTheme();
  const styles = createNotesStyles(colors);
  const [notes, setNotes] = useState<Note[] | null>(null);
  const { setNote } = useNote();

  useEffect(() => {
    if (!project?._id) {
      setNotes(null);
      return;
    }

    const fetchNotes = async () => {
      try {
        const res = await api.get(`/projects/${project._id}/notes`);
        setNotes(res.data.data);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
      }
    };

    fetchNotes();
  }, [project?._id]);

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.mutedText}>
          Select a project first to view notes
        </Text>
      </View>
    );
  }

  if (!notes) {
    return (
      <View style={styles.center}>
        <Text style={styles.mutedText}>Fetching notes...</Text>
      </View>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>{project?.name} · Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.noteCard}
            onPress={() => {
              setNote({ title: item.title, content: item.content });
              router.push("/previewNote");
            }}
          >
            <Text style={styles.noteTitle} numberOfLines={2}>
              {item.title || "Title"}
            </Text>

            <Text style={styles.noteContent} numberOfLines={5}>
              {item.content}
            </Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>@{item.createdBy.username}</Text>
              <Text style={styles.metaText}>
                {new Date(item.createdAt).toLocaleString("en-US", {
                  month: "short",
                  year: "numeric",
                  day: "numeric",
                })}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Create Note FAB */}
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.fab}
        onPress={() => {
          router.push("/createNote");
        }}
      >
        <Ionicons name="add" size={24} color={colors.surface} />
        <Text style={styles.fabText}>New Note</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default Notes;
