// apiUser.ts
import { api } from "../services/api";

export type UserRole = "admin" | "logistica" | "financeiro";

export interface IUser {
    id?: number;
    name: string;
    email: string;
    password?: string; 
    role: UserRole;
}

export const getUsers = async (): Promise<IUser[]> => {
    const response = await api.get("/users");
    return response.data.results ?? [];
};


export const createUser = async (user: IUser) => {
    console.log("📤 Enviando usuário:", user);
    const response = await api.post("/users", user);
    return response.data;
};

export const updateUser = async (id: number, user: Partial<IUser>) => {
    console.log("📦 Atualizando usuário:", id, user);
    const response = await api.put(`/users/${id}`, user);
    return response.data;
};

export const deleteUser = async (id: number) => {
    console.log("🗑️ Deletando usuário:", id);
    await api.delete(`/users/${id}`);
};
