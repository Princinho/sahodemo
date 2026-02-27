import apiClient from "./apiClient";

export interface ProductRequestAttachment {
  imageUrl: string;
  objectName: string;
  mimeType: string;
  sizeBytes: number;
  fileName: string;
  uploadedAt: string;
}

export interface ProductRequestNote {
  id: string;
  authorId: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  attachment?: ProductRequestAttachment;
}

export interface ProductRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  country?: string;
  city?: string;
  description: string;
  quantity?: number;
  desiredDeadline?: string;
  budget?: string;
  referenceUrl?: string;
  referenceImage?: ProductRequestAttachment;
  status: "NEW" | "IN_PROGRESS" | "ANSWERED" | "REJECTED" | "CLOSED";
  notes?: ProductRequestNote[];
  answeredAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  items: ProductRequest[];
  page: number;
  limit: number;
  total: number;
}

export const productRequestsApi = {
  // Public
  create: async (
    requestData: {
      fullName: string;
      email: string;
      phone?: string;
      company?: string;
      country?: string;
      city?: string;
      description: string;
      quantity?: number;
      desiredDeadline?: string;
      budget?: string;
      referenceUrl?: string;
    },
    image?: File
  ) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(requestData));
    if (image) formData.append("image", image);
    const { data } = await apiClient.post("/product-requests", formData);
    return data;
  },

  // Admin
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    email?: string;
    q?: string;
  }): Promise<PaginatedResponse> => {
    const { data } = await apiClient.get("/admin/product-requests", { params });
    return data;
  },

  getById: async (id: string): Promise<ProductRequest> => {
    const { data } = await apiClient.get(`/admin/product-requests/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch(
      `/admin/product-requests/${id}/status`,
      { status }
    );
    return data;
  },

  addNote: async (id: string, content: string, file?: File) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ content }));
    if (file) formData.append("file", file);
    const { data } = await apiClient.post(
      `/admin/product-requests/${id}/notes`,
      formData
    );
    return data;
  },
};
