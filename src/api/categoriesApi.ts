import apiClient from "./apiClient";

export interface ApiCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  imageUrl: string;
}

interface PaginatedResponse {
  items: ApiCategory[];
  page: number;
  limit: number;
  total: number;
}

export const categoriesApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    q?: string;
    isActive?: boolean;
  }): Promise<PaginatedResponse> => {
    const { data } = await apiClient.get("/categories", { params });
    return data;
  },

  getById: async (id: string): Promise<ApiCategory> => {
    const { data } = await apiClient.get(`/categories/${id}`);
    return data;
  },

  getBySlug: async (slug: string): Promise<ApiCategory> => {
    const { data } = await apiClient.get(`/categories/slug/${slug}`);
    return data;
  },

  // Admin
  create: async (
    categoryData: { name: string; description?: string; isActive?: boolean },
    image?: File
  ) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(categoryData));
    if (image) formData.append("image", image);
    const { data } = await apiClient.post("/admin/categories", formData);
    return data;
  },

  update: async (
    id: string,
    categoryData: Record<string, any>,
    image?: File
  ) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(categoryData));
    if (image) formData.append("image", image);
    const { data } = await apiClient.patch(
      `/admin/categories/${id}`,
      formData
    );
    return data;
  },

  delete: async (id: string) => {
    const { data } = await apiClient.delete(`/admin/categories/${id}`);
    return data;
  },
};
