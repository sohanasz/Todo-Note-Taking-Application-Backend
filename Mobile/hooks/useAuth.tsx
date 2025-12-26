import { getItemAsync } from "expo-secure-store";
import { api } from "@/lib/api";
import { Platform } from "react-native";

export default async function useAuth({ setIsSignedInState }) {
  let token;

  if (Platform.OS !== "web") {
    token = await getItemAsync("token");
  } else {
    token = localStorage.getItem("token");
  }

  if (token) {
    const res = await api.get("/login/user");

    if (res && res.status === 200) {
      setIsSignedInState(true);
      return true;
    }
  }
  setIsSignedInState(false);
  return false;
}
