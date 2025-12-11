import axios from "axios";

// ================= Token =================
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

// ================= TYPES =================
export type CampaignType = "money" | "food" | "clothing";

export interface Campaign {
  id: number;
  name: string;
  description?: string | null;
  campaign_type: CampaignType;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  goal_quantity?: number | null;
  goal_amount?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CampaignPagination {
  results: Campaign[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ================= HELPERS =================
const buildCampaignPayload = (data: any) => {
  const payload: any = {
    name: data.name,
    description: data.description ?? null,
    start_date: data.start_date,
    end_date: data.end_date ?? null,
    campaign_type: data.campaign_type,
    is_active: data.is_active ?? true, // <---- NOVO: ativa por padrão
  };

  if (data.campaign_type === "money") {
    payload.goal_amount = data.goal_amount != null ? Number(data.goal_amount) : null;
    payload.goal_quantity = null;
  }

  if (data.campaign_type === "food" || data.campaign_type === "clothing") {
    payload.goal_quantity = data.goal_quantity != null ? Number(data.goal_quantity) : null;
    payload.goal_amount = null;
  }

  return payload;
};

// ================= ENDPOINTS =================
export const getCampaigns = async ({
  page = 1,
  limit = 10,
  name,
  created_from,
  created_to,
  campaign_type,
}: {
  page?: number;
  limit?: number;
  name?: string;
  created_from?: string;
  created_to?: string;
  campaign_type?: CampaignType;
}): Promise<CampaignPagination> => {
  const res = await api.get("/campaigns", {
    params: { page, limit, name, created_from, created_to, campaign_type },
  });
  return res.data;
};

export const getCampaignById = async (id: number): Promise<Campaign> => {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
};

export const createCampaign = async (data: any): Promise<Campaign> => {
  const payload = buildCampaignPayload({ ...data, is_active: true }); // força ativo
  const res = await api.post("/campaigns", payload);
  return res.data;
};

export const updateCampaign = async (id: number, data: any): Promise<Campaign> => {
  const payload = buildCampaignPayload(data);
  const res = await api.put(`/campaigns/${id}`, payload);
  return res.data;
};
