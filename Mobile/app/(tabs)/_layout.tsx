import { Tabs } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";

import { ThemeProvider } from "@/hooks/useTheme";
import { ProjectProvider } from "@/hooks/useProject";
import { NoteProvider } from "@/hooks/useNote";
import useTheme from "@/hooks/useTheme";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ProjectProvider>
        <NoteProvider>
          <ThemedTabs />
        </NoteProvider>
      </ProjectProvider>
    </ThemeProvider>
  );
}

function ThemedTabs() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="editProject"
        options={{
          href: null,
        }}
      />

      {/* Hidden from tab bar */}
      <Tabs.Screen
        name="select"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="notesList"
        options={{
          title: "Notes",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="createNote"
        options={{
          href: null,
          tabBarStyle: { display: "none" },
        }}
      />

      <Tabs.Screen
        name="previewNote"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="tasks"
        options={{
          title: "Tasks",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="checkmark-done-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
