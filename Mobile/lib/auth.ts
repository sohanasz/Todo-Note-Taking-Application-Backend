// lib/auth.ts
import { Platform } from "react-native";
import { api } from "./api";
import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";

type AuthResponse = {
  token: string;
  success: boolean;
};

function loginDataValidation(identifier: string, password: string) {
  const value = identifier.trim();

  return value.includes("@")
    ? { email: value, username: undefined, password: password }
    : { email: undefined, username: value, password: password };
}

export async function login(value: string, password: string) {
  const data = loginDataValidation(value, password);
  console.log(data, "DATA");

  const res = await api.post<AuthResponse>("/login", data);

  if (Platform.OS !== "web") {
    await setItemAsync("token", res.data.data.token);
    await setItemAsync("username", res.data.data.username);
    await setItemAsync("fullname", res.data.data.fullname);
    await setItemAsync("email", res.data.data.email);
    await setItemAsync("avatar", res.data.data.avatar);
    await setItemAsync("isEmailVerified", res.data.data.isEmailVerified);
  } else {
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("username", res.data.data.username);
    localStorage.setItem("name", res.data.data.fullname);
    localStorage.setItem("email", res.data.data.email);
    localStorage.setItem("avatar", res.data.data.avatar);
    localStorage.setItem("isEmailVerified", res.data.data.isEmailVerified);
  }

  return res.data;
}

export async function register(
  fullname: string,
  username: string,
  email: string,
  password: string
) {
  const res = await api.post<AuthResponse>("/register", {
    fullname: fullname,
    username: username,
    email: email,
    password: password,
  });

  if (Platform.OS !== "web") {
    await setItemAsync("token", res.data.data.token);
    await setItemAsync("username", res.data.data.username);
    await setItemAsync("fullname", res.data.data.fullname);
    await setItemAsync("email", res.data.data.email);
    await setItemAsync("avatar", res.data.data.avatar);
    await setItemAsync("isEmailVerified", res.data.data.isEmailVerified);
  } else {
    localStorage.setItem("token", res.data.data.token);
    localStorage.setItem("username", res.data.data.username);
    localStorage.setItem("name", res.data.data.fullname);
    localStorage.setItem("email", res.data.data.email);
    localStorage.setItem("avatar", res.data.data.avatar);
    localStorage.setItem("isEmailVerified", res.data.data.isEmailVerified);
  }

  return res.data;
}

export async function logout() {
  await deleteItemAsync("token");
}
