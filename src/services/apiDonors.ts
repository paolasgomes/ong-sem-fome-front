import type { Pagination, Donor } from "../types/Donors";
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

export const getDonors = async (): Promise<Pagination<Donor>> => {
  const response = await api.get<Pagination<Donor>>("/donors");
  return response.data ?? { limit: 0, page: 0, totalPages: 0, results: [] };
};

export const createDonor = async (donor: Donor) => {
  const response = await api.post("/donors", donor);
  return response.data;
};

export const updateDonor = async (id: number, donor: Donor) => {
  const response = await api.put(`/donors/${id}`, donor);
  return response.data;
};

export const deleteDonor = async (id: number) => {
  await api.delete(`/donors/${id}`);
};
