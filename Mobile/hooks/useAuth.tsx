import { getItemAsync } from "expo-secure-store";
import { api } from "@/lib/api";

export default async function useAuth({ setIsSignedInState }) {
  const token = await getItemAsync("token");

  if (token) {
    const res = await api.get("/login/user");
    if (res.status === 200) {
      setIsSignedInState(true);
      return true;
    }
  }
  setIsSignedInState(false);
  return false;
}
