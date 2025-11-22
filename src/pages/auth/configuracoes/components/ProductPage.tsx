import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { getProducts, createProduct, updateProduct } from "../../../../services/apiProducts";
import type { Product } from "../../../../services/apiProducts";
import { ProductFormModal } from "../../configuracoes/components/ProductFormModal";

export function ProductsPage() {
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(false);
const [showForm, setShowForm] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

//Estados da paginação
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

const fetchProducts = async () => {
    try {
    setLoading(true);
    const response = await getProducts();
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

//Cálculo da paginação
const totalPages = Math.ceil(products.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

return (
    <div className="p-10 bg-gray-50 min-h-screen text-gray-700 text-sm">

    <div className="flex justify-between items-center mb-10">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Produtos</h1>
        <p className="text-gray-500 mt-1">Cadastro e gerenciamento de produtos</p>
        </div>

        <button
        onClick={() => { setSelectedProduct(null); setShowForm(true); }}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
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
            <th className="py-3 px-6">Estoque Mínimo</th>
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

            {currentItems.map((p) => (
            <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium">{p.name}</td>
                <td>{p.category?.name ?? "-"}</td>
                <td className="py-3 px-6">{p.unit}</td>
                <td className="py-3 px-6">{p.minimum_stock ?? "-"}</td>
                <td className="py-3 px-6 text-center">
                <button
                    className="text-orange-500 hover:text-orange-700 cursor-pointer"
                    onClick={() => {
                    setSelectedProduct(p);
                    setShowForm(true);
                    }}
                >
                    Atualizar Produto
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

    {/*Paginação dinâmica — IGUAL ao modelo que você enviou */}
    <div className="flex justify-center mt-6 gap-2 items-center">
        <button
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
        &laquo; Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(page =>
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
        )
        .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            const showDots = prev && page - prev > 1;

            return (
            <span key={page} className="flex items-center">
                {showDots && <span className="px-2">...</span>}

                <button
                onClick={() => setCurrentPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                    page === currentPage
                    ? "bg-orange-500 text-white font-semibold"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                >
                {page}
                </button>
            </span>
            );
        })}

        <button
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
        Próximo &raquo;
        </button>
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
