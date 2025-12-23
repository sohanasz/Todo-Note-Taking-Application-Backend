import axios from "axios";
import { router } from "expo-router";
import { getItemAsync, setItemAsync, deleteItemAsync } from "expo-secure-store";
import { Alert } from "react-native";

const baseURL = "10.108.221.200:8000";

export const api = axios.create({
  baseURL: `http://${baseURL}/api/v1`,
  timeout: 10000,
});

export function initiateInterceptors({ setIsSignedInState }) {
  api.interceptors.request.use(async (config) => {
    const token = await getItemAsync("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      try {
        if (
          error.response.status === 401 &&
          error.message === "Session Ended"
        ) {
          Alert.alert("Session ended", "Login again for new session");
          await deleteItemAsync("token");
          setIsSignedInState(false);
          router.replace("/");
        } else {
          return Promise.reject(error);
        }
      } catch (error) {
        Alert.alert(
          "Network Error",
          "Please check your internet or try signing in again!"
        );
        return Promise.reject(error);
      }
    }
  );
}
