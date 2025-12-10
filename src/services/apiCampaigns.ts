import axios from "axios";

// ================= Token =================
const getToken = () => localStorage.getItem("@ong:token") || "";

const api = axios.create({
  baseURL: "http://localhost:3000",
  headers: { "Content-Type": "application/json" },
});

// Adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== Types (compatíveis com o backend) ==========

export type CampaignType = "money" | "food" | "clothing";

export interface Campaign {
  id: number;
  name: string;
  description?: string | null;
  start_date: string;
  end_date?: string | null;
  is_active: boolean;
  campaign_type: CampaignType;
  goal_quantity?: number | null;
  goal_amount?: number | null;
  created_at?: string;
  updated_at?: string;
}

// Resposta correta da rota GET /campaigns
export interface CampaignPagination {
  results: Campaign[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ========== Endpoints ==========

// Buscar campanhas com paginação + filtros opcionais
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

// Buscar uma campanha específica
export const getCampaignById = async (id: number): Promise<Campaign> => {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
};

// Criar campanha
export const createCampaign = async (data: Partial<Campaign>): Promise<Campaign> => {
  const res = await api.post("/campaigns", data);
  return res.data;
};

// Atualizar campanha
export const updateCampaign = async (
  id: number,
  data: Partial<Campaign>
): Promise<Campaign> => {
  const res = await api.put(`/campaigns/${id}`, data);
  return res.data;
};

// Deletar campanha
export const deleteCampaign = async (id: number) => {
  const res = await api.delete(`/campaigns/${id}`);
  return res.data;
};
