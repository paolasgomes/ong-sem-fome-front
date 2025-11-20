// src/services/apiProducts.ts
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
export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  created_at: string;
}

export interface Pagination<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}

// ========== Endpoints ==========
export const getProducts = async (page = 1, limit = 10): Promise<Pagination<Product>> => {
  const res = await api.get("/products", { params: { page, limit } });
  return res.data;
};

export const createProduct = async (data: Partial<Product>) => {
  const res = await api.post("/products", data);
  return res.data;
};
