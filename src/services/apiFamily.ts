import type { Pagination, Family } from "../types/Family";
import {api} from "../services/api"


export const getFamily = async (): Promise<Pagination<Family>> => {
    const response = await api.get<Pagination<Family>>("/families");
    return response.data ?? { limit: 0, page: 0, totalPages: 0, results: [] };
};

export const createFamily = async (family: Family) => {
    console.log("📤 Enviando família:", family);

    const payload = {
        ...family,
        members_count: Number(family.members_count) || 0,
        responsible_cpf: family.responsible_cpf.replace(/\D/g, ""),
        phone: family.phone.replace(/\D/g, ""),
        address: `${family.street_address}, ${family.street_number}, ${family.street_neighborhood}`,
    };

    const response = await api.post("/families", payload);
    return response.data;
}
/*export const createFamily = async (family: Family) => {
    console.log("📤 Enviando família:", family);
    const response = await api.post("/families", family);
    return response.data;
};*/


export const updateFamily = async (id: number, family: Family) => {
    console.log("✏️ Atualizando família:", family);

    const payload = {
        ...family,
        members_count: Number(family.members_count) || 0,
        responsible_cpf: family.responsible_cpf.replace(/\D/g, ""),
        phone: family.phone.replace(/\D/g, ""),
        address: `${family.street_address}, ${family.street_number}, ${family.street_neighborhood}`,
    };

    const response = await api.put(`/families/${id}`, payload);
    return response.data;
};

/*export const updateFamily = async (id: number, family: Family) => {
    const response = await api.put(`/families/${id}`, family);
    return response.data;
};*/

export const deleteFamily = async (id: number) => {
    await api.delete(`/families/${id}`);
};