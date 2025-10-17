// src/services/api.ts
import axios from "axios";

export const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
});

// Injeta o token automaticamente (se existir)
api.interceptors.request.use((config) => {
const token = localStorage.getItem("@ong:token");
if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
}
return config;
});

export type AuthUser = {
email: string;
};

export type LoginResponse = {
token: string;
user: AuthUser;
};

export async function loginRequest(email: string, password: string) {
const { data } = await api.post<LoginResponse>("/auth", { email, password });
return data;
}

export function saveSession(token: string, user: AuthUser) {
localStorage.setItem("@ong:token", token);
localStorage.setItem("@ong:user", JSON.stringify(user));
}

export function loadSession(): { token: string | null; user: AuthUser | null } {
const token = localStorage.getItem("@ong:token");
const userRaw = localStorage.getItem("@ong:user");
return { token, user: userRaw ? JSON.parse(userRaw) : null };
}

export function clearSession() {
localStorage.removeItem("@ong:token");
localStorage.removeItem("@ong:user");
}
