// src/services/apiProducts.ts
import axios from "axios";
import type { ICategory } from "./apiCategory";

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

export interface Product {
  id?: number;
  name: string;
  unit: string;
  minimum_stock: number;
  in_stock: number;
  is_active: boolean;
  category_id: number | null;
  category?: ICategory | null;
}

export interface Pagination<T> {
  results: T[];
  page: number;
  limit: number;
  total: number;
}

export const getProducts = async (page = 1, limit = 10): Promise<Pagination<Product>> => {
  const res = await api.get("/products", { params: { page, limit } });
  return res.data;
};

export const createProduct = async (data: Partial<Product>) => {
  const res = await api.post("/products", data);
  return res.data;
};

export const updateProduct = async (id: number, data: Partial<Product>) => {
  console.log("Enviando para update:", data);
  const res = await api.put(`/products/${id}`, data);
  return res.data;
};
