import apiClient from "./apiClient";
import { useAuthStore } from "@/stores/authStore";

export const authApi = {
  login: async (email: string, password: string) => {
    const { data } = await apiClient.post("/auth/login", { email, password });
    const token = data.access_token || data.accessToken;
    useAuthStore.getState().setAccessToken(token);
    return data;
  },

  logout: async () => {
    try {
      await apiClient.post("/auth/logout");
    } finally {
      useAuthStore.getState().logout();
    }
  },

  refresh: async () => {
    const { data } = await apiClient.post("/auth/refresh");
    const token = data.accessToken || data.access_token;
    useAuthStore.getState().setAccessToken(token);
    return token;
  },
};
