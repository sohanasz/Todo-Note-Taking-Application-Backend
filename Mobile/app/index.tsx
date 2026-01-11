import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import SignInScreen from "../components/SignIn";
import SignUpScreen from "../components/SignUp";
import { router } from "expo-router";
import { initiateInterceptors } from "@/lib/api";
import useTheme from "@/hooks/useTheme";
import { useAuth } from "@/lib/auth";
import { useAuthContext } from "@/hooks/useAuth";

export default function Index() {
  const { isSignedInState, setIsSignedInState } = useAuthContext();
  const [signInScreen, setSignInScreen] = useState<boolean>(true);
  const [signingIn, setSigningIn] = useState(true);

  const { colors } = useTheme();

  useEffect(() => {
    initiateInterceptors({ setIsSignedInState });

    const verifyAuth = async () => {
      if (await useAuth({ setIsSignedInState })) {
        router.replace("/(tabs)/home");
      } else {
        setSigningIn(false);
      }
    };

    verifyAuth();
  }, []);

  if (signingIn) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text>Signing In....</Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: colors.bg,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {signInScreen ? (
        <SignInScreen setSignInScreen={setSignInScreen} />
      ) : (
        <SignUpScreen setSignInScreen={setSignInScreen} />
      )}
    </View>
  );
}
