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

// ----- GET: todos os colaboradores -----
export const getCollaborators = async (): Promise<Collaborator[]> => {
  const response = await api.get("/collaborators");
  return response.data;
};

// ----- POST: criar colaborador -----
export const createCollaborator = async (collab: Collaborator): Promise<Collaborator> => {
  const payload = {
    ...collab,
    registration: collab.id?.toString() || Date.now().toString(),
    admission_date: collab.date_joined,
    is_volunteer: collab.type === "Voluntário",
    sector_id: 1,
    user_id: 1,
  };
  const response = await api.post("/collaborators", payload);
  return response.data;
};

// ----- PUT: atualizar colaborador -----
export const updateCollaborator = async (id: number, collab: Collaborator): Promise<Collaborator> => {
  const payload = {
    ...collab,
    registration: collab.id?.toString() || id.toString(),
    admission_date: collab.date_joined,
    is_volunteer: collab.type === "Voluntário",
    sector_id: 1,
    user_id: 1,
  };
  const response = await api.put(`/collaborators/${id}`, payload);
  return response.data;
};

// ----- DELETE: remover colaborador -----
export const deleteCollaborator = async (id: number): Promise<void> => {
  await api.delete(`/collaborators/${id}`);
};
