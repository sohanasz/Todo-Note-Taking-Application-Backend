import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import useTheme from "@/hooks/useTheme";
import { createCreateProjectStyles } from "@/assets/styles/CreateProjectScreen";
import { api } from "@/lib/api";

const CreateProjectScreen = () => {
  const { colors } = useTheme();
  const styles = createCreateProjectStyles(colors);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const createProject = async () => {
    try {
      const res = await api.post("/projects", {
        name: name,
        description: description,
      });

      if (res.data.success)
        Alert.alert("Success✅", "Project Created Successfully🎉");
    } catch (err) {
      console.error("Failed to create project", err);
    } finally {
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter project name"
            placeholderTextColor={colors.textMuted}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Describe your project"
            placeholderTextColor={colors.textMuted}
            multiline
            style={[styles.input, styles.textArea]}
          />
        </View>
      </View>

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={createProject}
      >
        <Text style={styles.buttonText}>Create Project</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateProjectScreen;
