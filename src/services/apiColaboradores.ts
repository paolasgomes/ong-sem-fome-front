import axios from "axios";
import type { Collaborator } from "../types/Colaboradores";

// Recupera o token salvo no localStorage
const getToken = () => localStorage.getItem("@ong:token") || "";

// Instância do Axios com baseURL e headers padrão
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----- GET: todos os colaboradores -----
export const getCollaborators = async (page = 1, limit = 100) => {
  const response = await api.get(`/collaborators?page=${page}&limit=${limit}`);
  return response.data;
};

// ----- POST: criar colaborador -----
export const createCollaborator = async (collab: any) => {
  const payload = {
    name: collab.name,
    email: collab.email,
    phone: collab.phone,
    registration: collab.registration ?? Date.now().toString(),
    admission_date: collab.admission_date ?? null,
    dismissal_date: collab.dismissal_date ?? null,
    is_volunteer: collab.is_volunteer ?? false,
    sector_id: collab.sector_id ?? null,
    user_id: collab.user_id ?? null,
    function: collab.function ?? null,
    observation: collab.observation ?? null,
    status: collab.status ?? "Ativo",
  };
  const response = await api.post("/collaborators", payload);
  return response.data;
};

// ----- PUT: atualizar colaborador -----
export const updateCollaborator = async (id: number, collab: any) => {
  const payload = {
    name: collab.name,
    registration: String(collab.registration),
    email: collab.email,
    phone: collab.phone,
    admission_date: collab.admission_date ?? null,
    dismissal_date: collab.dismissal_date ?? null,
    is_volunteer: collab.is_volunteer ?? false,
    sector_id: collab.sector_id ?? null,
    user_id: collab.user_id ?? null,
    function: collab.function ?? null,
    observation: collab.observation ?? null,
    status: collab.status ?? "Ativo",
    is_active: collab.status === "Ativo",
  };

  console.log("Payload enviado para PUT:", payload);

  const response = await api.put(`/collaborators/${id}`, payload);
  return response.data;
};

// ----- DELETE: remover colaborador -----
export const deleteCollaborator = async (id: number) => {
  await api.delete(`/collaborators/${id}`);
};
