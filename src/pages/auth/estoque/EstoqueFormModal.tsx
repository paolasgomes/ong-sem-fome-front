import { useEffect, useState } from "react";
import { updateStock } from "../../../services/apiStock";
import { getProducts } from "../../../services/apiProducts";

interface Props {
    type: "entrada" | "editar";
    product?: any; 
    onClose: () => void;
    onUpdated?: () => void; 
}

export function EstoqueFormModal({ type, product, onClose, onUpdated }: Props) {
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState("");

    // Carrega produtos apenas no modo ENTRADA
    useEffect(() => {
        if (type === "entrada") {
            loadProducts();
        }
    }, []);

    async function loadProducts() {
    const response = await getProducts(1, 999);

    setProducts(response.results || []); 
}

    async function handleSubmit() {
        const q = Number(quantity);
        if (!q) return alert("Informe uma quantidade válida.");

        if (type === "entrada") {
            if (!selectedProductId)
                return alert("Selecione um produto");

            await updateStock(Number(selectedProductId), q);
        }

        if (type === "editar" && product) {
            await updateStock(product.id, q);
        }

        alert("Operação realizada com sucesso!");
        onUpdated?.();
        onClose();
    }

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
                
                <h2 className="text-lg font-semibold mb-4">
                    {type === "entrada" ? "Entrada Manual" : "Atualizar Estoque"}
                </h2>

                {/* Selecionar produto apenas no modo ENTRADA */}
                {type === "entrada" && (
                    <>
                        <label className="text-sm font-medium">Produto</label>
                        <select
                            className="w-full border rounded-lg px-3 py-2 mb-4"
                            value={selectedProductId}
                            onChange={(e) => setSelectedProductId(e.target.value)}
                        >
                            <option value="">Selecione...</option>

                            {products.length > 0 ? (
                                products.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))
                            ) : (
                                <option disabled>Nenhum produto encontrado</option>
                            )}
                        </select>
                    </>
                )}

                {/* Campo quantidade */}
                <label className="text-sm font-medium">Quantidade</label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2 mb-4"
                    placeholder="Ex: 20"
                />

                <div className="flex justify-end gap-3">
                    <button
                        className="px-4 py-2 bg-gray-300 rounded-lg"
                        onClick={onClose}
                    >
                        Cancelar
                    </button>

                    <button
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                        onClick={handleSubmit}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
