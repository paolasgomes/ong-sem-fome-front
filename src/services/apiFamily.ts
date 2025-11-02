import type { Pagination, Family } from "../types/Family";
import {api} from "../services/api"
import {formatFamilyPayload} from "../utils/formatFamilyPayload"

export const getFamily = async (page = 1, limit = 100): Promise<Pagination<Family>> => {
    const response = await api.get<Pagination<Family>>(`/families?page=${page}&limit=${limit}`);
    return response.data;
};

export const createFamily = async (family: Family) => {
    console.log("📤 Enviando família:", family);
    const payload = formatFamilyPayload(family);
    const response = await api.post("/families", payload);
    return response.data;
};

export const updateFamily = async (id: number, family: Family) => {
    const payload = formatFamilyPayload(family);
    console.log("📦 Payload final enviado para update:", payload);
    const response = await api.put(`/families/${id}`, payload);
    return response.data;
};

export const deleteFamily = async (id: number) => {
    await api.delete(`/families/${id}`);
};