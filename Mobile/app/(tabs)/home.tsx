import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import useTheme from "@/hooks/useTheme";
import { createHomeStyles } from "@/assets/styles/home";
import SafeScreen from "@/components/SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";
import CreateProjectScreen from "@/components/CreateProjectScreen";
import useProject from "@/hooks/useProject";
import { router } from "expo-router";

type Project = {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: {
    username: string;
  };
};

export default function ProjectsListScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { project, setProject } = useProject();
  const [loading, setLoading] = useState(true);
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  useEffect(() => {
    fetchProjects();
  }, [showCreateProject]);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data.data);
    } catch (err) {
      console.error("Failed to fetch projects", err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: Project }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        style={styles.card}
        onPress={() => {
          setProject(item);
          router.push("/select");
        }}
      >
        <Text style={styles.projectName}>{item.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            Created by{": @"}
            <Text style={styles.bold}>{item.createdBy.username}</Text>
          </Text>
          <Text style={styles.metaText}>
            {new Date(item.createdAt).toDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeScreen style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <Text style={styles.sectionTitle}>
        {showCreateProject ? "Create Project" : "Projects"}
      </Text>
      {showCreateProject ? (
        <CreateProjectScreen />
      ) : (
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          setShowCreateProject((state) => {
            return !state;
          });
        }}
      >
        <Ionicons
          name={showCreateProject ? "close" : "add"}
          size={26}
          color="#fff"
        />
        <Text style={styles.fabText}>
          {showCreateProject ? "" : "Create Project"}
        </Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}
