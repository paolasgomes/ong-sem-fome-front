import axios from "axios";
import type { Collaborator } from "../types/Colaboradores";

const getToken = () => localStorage.getItem("@ong:token") || "";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// GET: todos os colaboradores
export const getCollaborators = async (page = 1, limit = 100) => {
  const response = await api.get(`/collaborators?page=${page}&limit=${limit}`);
  return response.data;
};

// POST: criar colaborador
export const createCollaborator = async (collab: any) => {
  const payload = {
    name: collab.name,
    registration: collab.registration ?? Date.now().toString(),
    email: collab.email,
    phone: collab.phone,
    admission_date: collab.admission_date ?? null,
    dismissal_date: collab.dismissal_date ?? null,
    is_volunteer: collab.is_volunteer ?? false,
    function: collab.function ?? null,
    observation: collab.observation ?? null,
    is_active: true,
    sector_id: collab.sector_id ?? null,
    user_id: collab.user_id ?? null,
  };
  const response = await api.post("/collaborators", payload);
  return response.data;
};


// PUT: atualizar colaborador
export const updateCollaborator = async (id: number, collab: any) => {
  const payload = {
    name: collab.name,
    registration: String(collab.registration),
    email: collab.email,
    phone: collab.phone,
    admission_date: collab.admission_date ?? null,
    dismissal_date: collab.dismissal_date ?? null,
    is_volunteer: collab.is_volunteer ?? false,
    function: collab.function ?? null,
    observation: collab.observation ?? null,
    is_active: collab.is_active,
    sector_id: collab.sector_id ?? null,
    user_id: collab.user_id ?? null,
  };

  console.log("Payload enviado para PUT:", payload);

  const response = await api.put(`/collaborators/${id}`, payload);
  return response.data;
};

// DELETE: remover colaborador
export const deleteCollaborator = async (id: number) => {
  await api.delete(`/collaborators/${id}`);
};
