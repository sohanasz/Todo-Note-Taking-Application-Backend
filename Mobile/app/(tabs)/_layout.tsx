import { Tabs } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/hooks/useTheme";
import SafeScreen from "@/components/safe-screen";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="home" />
        <Tabs.Screen name="settings" />
      </Tabs>
    </ThemeProvider>
  );
}
