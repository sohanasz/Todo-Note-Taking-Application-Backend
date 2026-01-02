import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import SignInScreen from "../components/SignIn";
import SignUpScreen from "../components/SignUp";
import useAuth from "@/hooks/useAuth";
import { router } from "expo-router";
import { initiateInterceptors } from "@/lib/api";

export default function Index() {
  const [signInScreen, setSignInScreen] = useState<boolean>(false);
  const [isSignedInState, setIsSignedInState] = useState<boolean>(false);
  const [signingIn, setSigningIn] = useState(true);

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
