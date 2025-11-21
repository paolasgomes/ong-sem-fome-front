// services/apiCategory.ts
import { api } from "./api";

export interface ICategory {
    id: number;
    name: string;
    is_perishable: boolean;
    created_at: string | null;
    updated_at: string | null;
}

export interface ICreateCategoryDTO { name: string; is_perishable?: boolean }
export interface IUpdateCategoryDTO { name?: string; is_perishable?: boolean }

export interface IPaginatedCategories {
    results: ICategory[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export async function createCategory(data: ICreateCategoryDTO) {
    const response = await api.post<ICategory>("/categories", data);
    return response.data;
}

export async function updateCategory(id: number, data: IUpdateCategoryDTO) {
    const response = await api.put<ICategory>(`/categories/${id}`, data);
    return response.data;
}

export async function getCategories() {
    const response = await api.get<IPaginatedCategories>("/categories");
    return response.data;
}

export async function getCategoryById(id: number) {
    const response = await api.get<ICategory>(`/categories/${id}`);
    return response.data;
}
