import axios from "axios";
import type { Pagination, Donation } from "../types/Doacoes";

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

// ====== Endpoints ======

export const getDonations = async (
  page = 1,
  limit = 10
): Promise<Pagination<Donation>> => {
  const response = await api.get<Pagination<Donation>>("/donations", {
    params: { page, limit },
  });
  return response.data;
};

export const createDonation = async (donation: Partial<Donation>) => {
  const response = await api.post("/donations", donation);
  return response.data;
};
