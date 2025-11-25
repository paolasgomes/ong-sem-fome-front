export function calculateStockInfo(product: any) {
const min = product.minimum_stock;
const capacity = min * 10;
const inStock = product.in_stock;

const percent = Math.round((inStock / capacity) * 100);
const aboveMin = inStock - min;

const criticalLimit = min * 0.2;
const lowLimit = min * 0.10;

let status = "Normal";

if (aboveMin <= criticalLimit) {
    status = "Crítico";
} else if (aboveMin <= lowLimit) {
    status = "Baixo";
}

return {
    capacity,
    percent,
    status
};
}
