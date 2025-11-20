import axios from "axios";

const getToken = () => localStorage.getItem("@ong:token") || "";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== Types ==========
export interface Campaign {
  id: number;
  name: string;
  description?: string;
  start_date?: string;
  end_date?: string;
}

export interface Pagination<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// ========== Endpoints ==========
export const getCampaigns = async (
  page = 1,
  limit = 10
): Promise<Pagination<Campaign>> => {
  const res = await api.get("/campaigns", { params: { page, limit } });
  return res.data;
};

export const getCampaignById = async (id: number) => {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
};

export const createCampaign = async (data: Partial<Campaign>) => {
  const res = await api.post("/campaigns", data);
  return res.data;
};

export const updateCampaign = async (id: number, data: Partial<Campaign>) => {
  const res = await api.put(`/campaigns/${id}`, data);
  return res.data;
};

export const deleteCampaign = async (id: number) => {
  const res = await api.delete(`/campaigns/${id}`);
  return res.data;
};
