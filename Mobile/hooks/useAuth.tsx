import { getItemAsync, setItemAsync } from "expo-secure-store";
import { api } from "@/lib/api";
import { Platform } from "react-native";

export default async function useAuth({ setIsSignedInState }) {
  let token: string;

  if (Platform.OS !== "web") {
    token = await getItemAsync("token");
  } else {
    token = localStorage.getItem("token");
  }

  if (token) {
    const res = await api.get("/login/user");

    if (res && res.status === 200) {
      setIsSignedInState(true);

      if (Platform.OS !== "web") {
        await setItemAsync("name", res.data.user.fullname);
        await setItemAsync("username", res.data.user.username);
      } else {
        localStorage.setItem("username", res.data.user.username);
        localStorage.setItem("name", res.data.user.fullname);
      }

      return true;
    }
  }
  setIsSignedInState(false);
  return false;
}
