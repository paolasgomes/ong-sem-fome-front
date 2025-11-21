import axios from "axios";
import type { Pagination, Donation } from "../types/Doacoes";

export interface CreateDonationPayload {
  donor_id: number;
  type: "food" | "clothing" | "money" | "campaign";
  amount?: number;
  quantity?: number;
  unit?: "kg" | "g" | "l" | "ml" | "un";
  observations?: string;
  campaign_id?: number;
  product_id?: number;
  collaborator_id: number;
}

const getToken = () => localStorage.getItem("@ong:token") || "";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("@ong:token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const getDonations = async (
  page = 1,
  limit = 10
): Promise<Pagination<Donation>> => {
  const response = await api.get<Pagination<Donation>>("/donations", {
    params: { page, limit },
  });
  return response.data;
};

export const createDonation = async (donation: CreateDonationPayload) => {
  const payload: CreateDonationPayload = {
    ...donation,
    donor_id: Number(donation.donor_id),
    collaborator_id: Number(donation.collaborator_id),
    amount: donation.amount ? Number(donation.amount) : undefined,
    quantity: donation.quantity ? Number(donation.quantity) : undefined,
    campaign_id: donation.campaign_id ? Number(donation.campaign_id) : undefined,
    product_id: donation.product_id ? Number(donation.product_id) : undefined,
  };

  const response = await api.post<Donation>("/donations", payload);
  return response.data;
};
