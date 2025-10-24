// services/api.ts
import axios from "axios";

const TOKEN_KEY = "@ong:token";
const USER_KEY  = "@ong:user";

export const api = axios.create({
baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
},
});

// Request: anexa Bearer token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response: trata 401 (expirado/invalidado)
api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err?.response?.status === 401) {
        clearSession();
        // opcional: redirecionar
        // window.location.href = "/login";
        }
        return Promise.reject(err);
}
);

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
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadSession(): { token: string | null; user: AuthUser | null } {
    const token = localStorage.getItem(TOKEN_KEY);
    const userRaw = localStorage.getItem(USER_KEY);
    return { token, user: userRaw ? JSON.parse(userRaw) : null };
}

export function clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
}

// (opcional) helpers de acesso
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setSession = (r: LoginResponse) => saveSession(r.token, r.user);
