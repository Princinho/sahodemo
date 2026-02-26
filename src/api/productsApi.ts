import apiClient from "./apiClient";
import { Product } from "@/models/Product";

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
}

export const productsApi = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    isTrending?: boolean;
    isDisabled?: boolean;
    sort?: string;
  }): Promise<PaginatedResponse<Product>> => {
    const { data } = await apiClient.get("/products", { params });
    return data;
  },

  // Admin
  create: async (productData: Record<string, any>, images?: File[]) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(productData));
    if (images) {
      images.forEach((f) => formData.append("images", f));
    }
    const { data } = await apiClient.post("/admin/products/add", formData);
    return data;
  },

  update: async (
    id: string,
    productData: Record<string, any>,
    images?: File[]
  ) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(productData));
    if (images) {
      images.forEach((f) => formData.append("images", f));
    }
    const { data } = await apiClient.patch(
      `/admin/products/update/${id}`,
      formData
    );
    return data;
  },
};
