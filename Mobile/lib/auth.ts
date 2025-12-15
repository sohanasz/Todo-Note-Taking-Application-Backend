// lib/auth.ts
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

  await setItemAsync("token", data.token);

  return data;
}

export async function register(name: string, email: string, password: string) {
  const { data } = await api.post<AuthResponse>("/register", {
    name,
    email,
    password,
  });

  await setItemAsync("token", data.token);

  return data;
}

export async function logout() {
  await deleteItemAsync("token");
}
