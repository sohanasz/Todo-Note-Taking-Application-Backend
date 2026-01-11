import { Platform } from "react-native";
import { api } from "./api";
import { setItemAsync, deleteItemAsync, getItemAsync } from "expo-secure-store";

type AuthResponse = {
  token: string;
  success: boolean;
};

async function setLocalData(data, saveToken = true) {
  console.log("LOCAL DATA", data);

  if (Platform.OS !== "web") {
    if (saveToken) {
      await setItemAsync("token", data.token);
    }
    await setItemAsync("userId", data._id);
    await setItemAsync("username", data.username);
    await setItemAsync("fullname", data.fullname);
    await setItemAsync("email", data.email);
    await setItemAsync("avatar", data.avatar.url);
    await setItemAsync("isEmailVerified", data.isEmailVerified.toString());
  } else {
    if (saveToken) {
      localStorage.setItem("token", data.token);
    }
    localStorage.setItem("userId", data._id);
    localStorage.setItem("username", data.username);
    localStorage.setItem("name", data.fullname);
    localStorage.setItem("email", data.email);
    localStorage.setItem("avatar", data.avatar);
    localStorage.setItem("isEmailVerified", data.isEmailVerified);
  }
}

function loginDataValidation(identifier: string, password: string) {
  const value = identifier.trim();

  return value.includes("@")
    ? { email: value, username: undefined, password: password }
    : { email: undefined, username: value, password: password };
}

export async function login(value: string, password: string) {
  const data = loginDataValidation(value, password);

  const res = await api.post<AuthResponse>("/login", data);

  await setLocalData(res.data.data);

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

  await setLocalData(res.data.data);
  return res.data;
}

export async function logout() {
  await deleteItemAsync("token");
}

export async function useAuth({ setIsSignedInState }) {
  let token: string;

  if (Platform.OS !== "web") {
    token = await getItemAsync("token");
  } else {
    console.log("Test Token", localStorage.getItem("token"));

    token = localStorage.getItem("token");
  }

  console.log("AUTH CHECK 0.1", token);
  if (token) {
    const res = await api.get("/login/user");

    if (res && res.status === 200) {
      await setLocalData(res.data.user, false);

      setIsSignedInState(true);

      return true;
    }
  }
  setIsSignedInState(false);
  return false;
}
