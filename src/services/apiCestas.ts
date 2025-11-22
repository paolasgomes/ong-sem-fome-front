// src/services/apiFoodBaskets.ts
import { api } from "../services/api";

export interface FoodBasketItem {
  product_id: number;
  quantity: number;
  name?: string;   // quando vier do GET
}

export interface FoodBasket {
  id?: number;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  items: FoodBasketItem[];
}

export interface Pagination<T> {
  results: T[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

/* ---------------------------------------------------
      📌 LISTAR CESTAS (GET /food-baskets)
--------------------------------------------------- */
export const getFoodBaskets = async (
  page = 1,
  limit = 10
): Promise<Pagination<FoodBasket>> => {
  const res = await api.get("/food-baskets", {
    params: { page, limit },
  });
  return res.data;
};

/* ---------------------------------------------------
      📌 BUSCAR CESTA POR ID (GET /food-baskets/:id)
--------------------------------------------------- */
export const getFoodBasketById = async (id: number): Promise<FoodBasket> => {
  const res = await api.get(`/food-baskets/${id}`);
  return res.data;
};

/* ---------------------------------------------------
      📌 CRIAR CESTA (POST /food-baskets)
--------------------------------------------------- */
export const createFoodBasket = async (data: FoodBasket) => {
  const payload = {
    description: data.description,
    products: data.items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
    })),
  };

  console.log("📤 Enviando cesta:", payload);

  const res = await api.post("/food-baskets", payload);
  return res.data;
};

/* ---------------------------------------------------
      📌 ATUALIZAR CESTA (PUT /food-baskets/:id)
--------------------------------------------------- */
export const updateFoodBasket = async (id: number, data: FoodBasket) => {
  const payload = {
    description: data.description,
    products: data.items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
    })),
  };

  console.log("📦 Payload enviado para update:", payload);

  const res = await api.put(`/food-baskets/${id}`, payload);
  return res.data;
};

/* ---------------------------------------------------
      📌 DELETAR CESTA (DELETE /food-baskets/:id)
--------------------------------------------------- */
export const deleteFoodBasket = async (id: number) => {
  await api.delete(`/food-baskets/${id}`);
};
