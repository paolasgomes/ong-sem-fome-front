import { api } from "./api";

export interface DistributionItem {
  name: string;
  quantity: number;
}

export interface Distribution {
  id: number;
  status: "pending" | "delivered" | "canceled";
  delivery_date: string | null;
  observations: string | null;

  food_basket: {
    id: number;
    description?: string;
    is_active: boolean;
    items: DistributionItem[];
  };

  collaborator?: {
    id: number;
    name: string;
    email?: string;
  };

  family?: {
    id: number;
    responsible_name: string;
    city?: string;
  };

  campaign?: {
    id: number;
    name: string;
  };
}

export interface Pagination<T> {
  results: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/* -------------------------------------------------------
   📌 LISTAR DISTRIBUIÇÕES
-------------------------------------------------------- */
export const getDistributions = async (
  page = 1,
  limit = 10
): Promise<Pagination<Distribution>> => {
  const res = await api.get("/food-basket-distributions", {
    params: { page, limit },
  });
  return res.data;
};

/* -------------------------------------------------------
   📌 REGISTRAR DISTRIBUIÇÃO (Criar Saída)
-------------------------------------------------------- */
export const createDistribution = async (data: {
  food_basket_id: number;
  collaborator_id?: number;
  campaign_id?: number;
  family_id?: number;
  delivery_date?: string;
  observations?: string;
  status?: "pending" | "delivered" | "canceled";
}) => {
  const res = await api.post("/food-basket-distributions", data);
  return res.data;
};

/* -------------------------------------------------------
   📌 ATUALIZAR STATUS DA DISTRIBUIÇÃO
-------------------------------------------------------- */
export const updateDistributionStatus = async (
  id: number,
  status: "pending" | "delivered" | "canceled"
) => {
  const res = await api.patch(`/food-basket-distributions/status/${id}`, {
    status,
  });
  return res.data;
};
