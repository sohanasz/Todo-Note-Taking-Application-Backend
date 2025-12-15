import { useState } from "react";
import { Text, View } from "react-native";
import SignInScreen from "../components/signin";
import SignUpScreen from "../components/signup";

export default function Index() {
  const [signInScreen, setSignInScreen] = useState(false);
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
