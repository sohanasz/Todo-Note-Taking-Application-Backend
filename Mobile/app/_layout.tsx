import { ThemeProvider } from "@/hooks/useTheme";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { initiateInterceptors } from "@/lib/api";
import { AuthProvider, useAuthContext } from "@/hooks/useAuth";

let initialized = false;

export default function RootLayout() {
  return (
    <AuthProvider>
      <InnerLayout />
    </AuthProvider>
  );
}

function InnerLayout() {
  const { setIsSignedIn } = useAuthContext();

  useEffect(() => {
    if (!initialized) {
      initiateInterceptors({ setIsSignedIn });
      initialized = true;
    }
  }, [setIsSignedIn]);

  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </ThemeProvider>
  );
}
