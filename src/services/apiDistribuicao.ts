import { api } from "./api";

// ---------- Types ----------
export interface DistributionItem {
  name: string;
  quantity: number;
}

export interface Distribution {
  id: number;
  status: "pending" | "delivered" | "canceled";
  delivery_date: string;
  observations?: string;
  food_basket: {
    id: number;
    name?: string;
    description?: string;
    is_active: boolean;
    items: DistributionItem[];
  };
  collaborator?: { id: number; name: string; email?: string };
  family?: { id: number; responsible_name: string; city?: string };
  campaign?: { id: number; name: string };
}

export interface Pagination<T> {
  results: T[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

// ---------- Endpoints ----------
export const getDistributions = async (
  page = 1,
  limit = 10
): Promise<Pagination<Distribution>> => {
  const res = await api.get("/food-distributions", { params: { page, limit } });
  return res.data;
};

export const getDistributionById = async (id: number): Promise<Distribution> => {
  const res = await api.get(`/food-distributions/${id}`);
  return res.data;
};

export const createDistribution = async (data: {
  food_basket_id: number;
  collaborator_id: number;
  family_id: number;
  campaign_id?: number;
  delivery_date: string;
  observations?: string;
  status?: "pending" | "delivered" | "canceled";
}) => {
  const res = await api.post("/food-distributions", data);
  return res.data;
};

export const updateDistributionStatus = async (
  id: number,
  status: "pending" | "delivered" | "canceled"
) => {
  const res = await api.patch(`/food-distributions/status/${id}`, { status });
  return res.data;
};
