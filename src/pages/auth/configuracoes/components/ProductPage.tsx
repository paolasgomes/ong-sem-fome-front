import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import { getProducts, createProduct, updateProduct } from "../../../../services/apiProducts";
import type { Product } from "../../../../services/apiProducts";
import { ProductFormModal } from "../../configuracoes/components/ProductFormModal";

export function ProductsPage() {
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
const [showForm, setShowForm] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

const fetchProducts = async () => {
    try {
        setLoading(true);
        const response = await getProducts();
        console.log(response.results)
        setProducts(response.results || []);
    } catch (err) {
        console.error(err);
        alert("Erro ao carregar produtos");
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    fetchProducts();
}, []);

const handleSave = async (data: Partial<Product>) => {
    try {
        setLoading(true);

        if (selectedProduct?.id !== undefined) {
        await updateProduct(selectedProduct.id, data);
        } else {
        await createProduct(data);
        }

        await fetchProducts();
        setShowForm(false);
        setSelectedProduct(null);
    } catch (err) {
        console.error(err);
        alert("Erro ao salvar produto");
    } finally {
        setLoading(false);
    }
};

return (
    <div className="p-10 bg-gray-50 min-h-screen text-gray-700 text-sm">

    <div className="flex justify-between items-center mb-10">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Produtos</h1>
        <p className="text-gray-500 mt-1">Cadastro e gerenciamento de produtos</p>
        </div>

        <button
        onClick={() => { setSelectedProduct(null); setShowForm(true); }}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
        >
        <Plus className="w-5 h-5" />
        Novo Produto
        </button>
    </div>

    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
            <th className="py-3 px-6">Nome</th>
            <th className="py-3 px-6">Categoria</th>
            <th className="py-3 px-6">Unidade</th>
            <th className="py-3 px-6">Em estoque</th>
            <th className="py-3 px-6 text-center">Ações</th>
            </tr>
        </thead>

        <tbody>
            {loading && products.length === 0 && (
            <tr>
                <td colSpan={5} className="py-6 text-center text-orange-500">
                Carregando...
                </td>
            </tr>
            )}

            {!loading && products.length === 0 && (
            <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                Nenhum produto cadastrado.
                </td>
            </tr>
            )}

            {products.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium">{p.name}</td>
                <td>{p.category?.name ?? "-"}</td>
                <td className="py-3 px-6">{p.unit}</td>
                <td className="py-3 px-6">{p.in_stock}</td>

                <td className="py-3 px-6 text-center">
                <button
                    className="text-blue-500 hover:text-blue-700"
                    onClick={() => {
                    setSelectedProduct(p);
                    setShowForm(true);
                    }}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                </td>
            </tr>
            ))}

        </tbody>
        </table>
    </div>

    {showForm && (
        <ProductFormModal
        onClose={() => setShowForm(false)}
        onSave={handleSave}
        product={selectedProduct}
        />
    )}

    </div>
);
}
