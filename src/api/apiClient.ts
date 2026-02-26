import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const API_BASE_URL = "https://sahobackend.onrender.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
apiClient.interceptors.response.use(null, async (error) => {
  const originalRequest = error.config;
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newToken = data.accessToken || data.access_token;
      useAuthStore.getState().setAccessToken(newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(originalRequest);
    } catch {
      useAuthStore.getState().logout();
      return Promise.reject(error);
    }
  }
  return Promise.reject(error);
});

export default apiClient;
