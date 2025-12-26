// lib/auth.ts
import { Platform } from "react-native";
import { api } from "./api";
import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";

type AuthResponse = {
  token: string;
  success: boolean;
};

export async function login(email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/login", {
    email,
    password,
  });

  if (Platform.OS !== "web") {
    await setItemAsync("token", data.token);
  } else {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/register", {
    name,
    email,
    password,
  });

  if (Platform.OS !== "web") {
    await setItemAsync("token", data.token);
  } else {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function logout() {
  await deleteItemAsync("token");
}
