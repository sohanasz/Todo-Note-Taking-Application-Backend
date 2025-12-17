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
import SafeScreen from "@/components/safe-screen";
import { Ionicons } from "@expo/vector-icons";
import { api } from "@/lib/api";

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
  const [loading, setLoading] = useState(true);

  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  useEffect(() => {
    fetchProjects();
  }, []);

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
      <View style={styles.card}>
        <Text style={styles.projectName}>{item.name}</Text>

        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            Created by{" "}
            <Text style={styles.bold}>{item.createdBy.username}</Text>
          </Text>
          <Text style={styles.metaText}>
            {new Date(item.createdAt).toDateString()}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeScreen>
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <FlatList
          data={projects}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
          <Ionicons name="add" size={26} color="#fff" />
          <Text style={styles.fabText}>Create Project</Text>
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
}
