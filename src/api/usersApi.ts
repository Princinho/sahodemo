import apiClient from "./apiClient";

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const usersApi = {
  create: async (body: { email: string; password: string }): Promise<AdminUser> => {
    const { data } = await apiClient.post("/admin/users", body);
    return data;
  },

  changePassword: async (body: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const { data } = await apiClient.post("/admin/users/me/password", body);
    return data;
  },
};
