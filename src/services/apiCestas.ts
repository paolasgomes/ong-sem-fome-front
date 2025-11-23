import { api } from "./api";

// ---------- Types ----------
export interface FoodBasketItem {
  product_id: number;
  quantity: number;
  name?: string;
}

export interface FoodBasket {
  id?: number;
  name?: string;
  description?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  items?: FoodBasketItem[];
}

export interface Pagination<T> {
  results: T[];
  page: number;
  limit: number;
  total: number;
  totalPages?: number;
}

export const getFoodBaskets = async (
  page = 1,
  limit = 10
): Promise<Pagination<FoodBasket>> => {
  const res = await api.get("/food-baskets", { params: { page, limit } });
  return res.data;
};

export const getFoodBasketById = async (id: number): Promise<FoodBasket> => {
  const res = await api.get(`/food-baskets/${id}`);
  return res.data;
};

export const createFoodBasket = async (data: FoodBasket) => {
  const payload = {
    name: data.name,
    description: data.description,
    is_active: data.is_active ?? true,
    products:
      data.items?.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      })) || [],
  };
  const res = await api.post("/food-baskets", payload);
  return res.data;
};

export const updateFoodBasket = async (id: number, data: FoodBasket) => {
  const payload = {
    name: data.name,
    description: data.description,
    is_active: data.is_active,
    products:
      data.items?.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      })) || [],
  };
  const res = await api.put(`/food-baskets/${id}`, payload);
  return res.data;
};

export const deleteFoodBasket = async (id: number) => {
  await api.delete(`/food-baskets/${id}`);
};
