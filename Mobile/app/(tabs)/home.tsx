import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import * as Animatable from "react-native-animatable";

import SafeScreen from "@/components/SafeScreen";
import CreateProjectScreen from "@/components/CreateProjectScreen";

import useTheme, { hexToRgba } from "@/hooks/useTheme";
import useProject from "@/hooks/useProject";
import { useNote } from "@/hooks/useNote";

import { api } from "@/lib/api";
import { createHomeStyles } from "@/assets/styles/home";

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
  const [showCreateProject, setShowCreateProject] = useState(false);

  const { project, setProject } = useProject();
  const { setNotes } = useNote();
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  useFocusEffect(
    useCallback(() => {
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
      fetchProjects();
    }, [showCreateProject])
  );

  const renderItem = ({ item }: { item: Project }) => {
    const selected = project?._id === item._id;

    return (
      <Animatable.View
        animation="pulse"
        duration={500}
        easing="ease-out-cubic"
        useNativeDriver
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.card}
          onPress={() => {
            setProject(item);
            setNotes(null);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => setProject(item)}>
              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={colors.primary}
                style={{ marginRight: 12 }}
              />
            </TouchableOpacity>

            <Text style={[styles.projectName, { flex: 1 }]}>{item.name}</Text>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              Created by: @
              <Text style={styles.bold}>{item.createdBy.username}</Text>
            </Text>
            <Text style={styles.metaText}>
              {new Date(item.createdAt).toDateString()}
            </Text>
          </View>

          {selected && (
            <Animatable.View
              animation="fadeIn"
              duration={500}
              easing="ease-out"
              useNativeDriver
              style={{
                marginTop: 12,
                backgroundColor: colors.bg,
                borderRadius: 8,
                padding: 6,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/editProject",
                    params: { members: false.toString() },
                  })
                }
              >
                <Ionicons name="create-outline" size={18} color={colors.text} />
                <Text style={{ color: colors.text, marginLeft: 10 }}>
                  Edit Project
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/editProject",
                    params: { members: true.toString() },
                  });
                }}
              >
                <Ionicons name="people-outline" size={18} color={colors.text} />
                <Text style={{ color: colors.text, marginLeft: 10 }}>
                  Manage Members
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/notesList",
                  });
                }}
              >
                <Ionicons name="book" size={18} color={colors.text} />
                <Text style={{ color: colors.text, marginLeft: 10 }}>
                  Notes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
                }}
                onPress={() => {
                  router.push({
                    pathname: "/tasks",
                  });
                }}
              >
                <Ionicons name="pencil" size={18} color={colors.text} />
                <Text style={{ color: colors.text, marginLeft: 10 }}>
                  Tasks
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </TouchableOpacity>
      </Animatable.View>
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

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => setShowCreateProject((prev) => !prev)}
      >
        <Ionicons
          name={showCreateProject ? "close" : "add"}
          size={26}
          color="#fff"
        />
        {!showCreateProject && (
          <Text style={styles.fabText}>Create Project</Text>
        )}
      </TouchableOpacity>
    </SafeScreen>
  );
}
