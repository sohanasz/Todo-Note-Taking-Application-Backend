import axios from "axios";
import { getItemAsync, setItemAsync } from "expo-secure-store";

export const api = axios.create({
  baseURL: "http://10.252.236.22:8000/api/v1/users",
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getItemAsync("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
