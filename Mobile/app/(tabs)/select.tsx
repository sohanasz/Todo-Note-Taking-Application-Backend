import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import useTheme from "@/hooks/useTheme";
import useProject from "@/hooks/useProject";
import { createProjectHomeStyles } from "@/assets/styles/select";
import SafeScreen from "@/components/SafeScreen";

const ProjectHome = () => {
  const { project } = useProject();
  const { colors } = useTheme();
  const styles = createProjectHomeStyles(colors);

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No project selected</Text>
      </View>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => {}}
      >
        <Text style={styles.cardTitle}>Notes</Text>
        <Text style={styles.cardSubtitle}>View and manage project notes</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => {}}
      >
        <Text style={styles.cardTitle}>Tasks</Text>
        <Text style={styles.cardSubtitle}>Track and complete tasks</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
};

export default ProjectHome;
