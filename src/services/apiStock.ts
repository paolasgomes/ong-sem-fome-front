// src/services/apiStock.ts
import { api } from "./api";

export async function updateStock(productId: number, quantity: number) {
    const response = await api.patch(`/stock/${productId}`, {
    quantity
});

    return response.data;
}
