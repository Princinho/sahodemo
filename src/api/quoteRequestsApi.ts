import apiClient from "./apiClient";

export interface QuoteItem {
  productId: string;
  quantity: number;
  productName?: string;
  productSlug?: string;
  unitPrice?: number;
}

export interface QuoteNote {
  id: string;
  authorId: string;
  authorEmail: string;
  content: string;
  createdAt: string;
  quotePdf?: {
    publicUrl: string;
    objectName: string;
    mimeType: string;
    sizeBytes: number;
  };
}

export interface QuoteRequest {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  country?: string;
  city?: string;
  address?: string;
  message?: string;
  items: QuoteItem[];
  status: "NEW" | "IN_PROGRESS" | "QUOTED" | "REJECTED" | "CLOSED";
  quotedAt?: string | null;
  notes?: QuoteNote[];
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse {
  items: QuoteRequest[];
  page: number;
  limit: number;
  total: number;
}

export const quoteRequestsApi = {
  // Public
  create: async (body: {
    fullName: string;
    email: string;
    phone?: string;
    country?: string;
    city?: string;
    address?: string;
    message?: string;
    items: { productId: string; quantity: number }[];
  }) => {
    const { data } = await apiClient.post("/quote-requests", body);
    return data;
  },

  // Admin
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<PaginatedResponse> => {
    const { data } = await apiClient.get("/admin/quote-requests", { params });
    return data;
  },

  getById: async (id: string): Promise<QuoteRequest> => {
    const { data } = await apiClient.get(`/admin/quote-requests/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string) => {
    const { data } = await apiClient.patch(
      `/admin/quote-requests/${id}/status`,
      { status }
    );
    return data;
  },

  addNote: async (id: string, content: string, pdf?: File) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ content }));
    if (pdf) formData.append("pdf", pdf);
    const { data } = await apiClient.post(
      `/admin/quote-requests/${id}/notes`,
      formData
    );
    return data;
  },
};
