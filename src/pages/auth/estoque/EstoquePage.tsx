import { useState, useEffect } from "react";
import { Pencil,Package ,TrendingDown,TrendingUp   } from "lucide-react";
import { calculateStockInfo } from "../../../utils/stockUtils";
import { getProducts } from "../../../services/apiProducts";
import { getCategories } from "../../../services/apiCategory";
import type { ICategory } from "../../../services/apiCategory";
import { EstoqueFormModal } from "./EstoqueFormModal";

export function EstoquePage() {
const [searchTerm, setSearchTerm] = useState("");
const [produtos, setProdutos] = useState<any[]>([]);
const [categorias, setCategorias] = useState<ICategory[]>([]);
const [loading, setLoading] = useState(true);

// Controle modal
const [modalType, setModalType] = useState<"entrada" | "editar" | null>(null);
const [selectedProduct, setSelectedProduct] = useState<any>(null);

// Paginação
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;

async function load() {
    try {
    setLoading(true);

    const prod = await getProducts(1, 999);
    const cats = await getCategories();

    const withStockInfo = (prod.results || []).map((p: any) => ({
        ...p,
        stockInfo: calculateStockInfo(p),
    }));

    setProdutos(withStockInfo);
    setCategorias(cats.results || []);
    } catch (error) {
    alert("Erro ao carregar produtos");
    } finally {
    setLoading(false);
    }
}

useEffect(() => {
    load();
}, []);

// FILTRO
const filteredProducts = produtos.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// PAGINAÇÃO
const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const pageItems = filteredProducts.slice(
    startIndex,
    startIndex + itemsPerPage
);

const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
};

return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700">
    {/* HEADER */}
    <div className="flex justify-between items-center mb-10">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Estoque</h1>
        <p className="text-gray-500 text-sm mt-2">
            Controle de produtos por categorias
        </p>
        </div>

        <button
        onClick={() => {
            setModalType("entrada");
            setSelectedProduct(null);
        }}
        className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow"
        >
        + Entrada Manual
        </button>
    </div>

    {/* CARDS DE RESUMO */}
    <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm">Total de Itens</p>
            <p className="text-2xl font-semibold">{produtos.length}</p>
        </div >
        <div className="bg-blue-50 p-4 rounded-full">
            <Package className="text-blue-500 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm">Estoque Baixo</p>
            <p className="text-2xl font-semibold">
            {produtos.filter(
                (p) => p.stockInfo.status !== "Normal"
            ).length}
            </p>
        </div>
        <div className="bg-red-50 p-4 rounded-full">
            <TrendingDown className="text-red-500 w-7 h-7" /> 
        </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 flex items-center justify-between">
        <div>
            <p className="text-gray-500 text-sm">Categorias</p>
            <p className="text-2xl font-semibold">{categorias.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-full">
            <TrendingUp className="text-green-500 w-7 h-7" /> 
        </div>
        </div>
    </div>

    {/* Busca */}
    <div className="mb-6">
        <input
        type="text"
        placeholder="Buscar produto..."
        className="border px-4 py-2 rounded-lg w-80"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
    </div>

    {/* Tabela */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
            <th className="py-3 px-6">Produto</th>
            <th className="py-3 px-6">Categoria</th>
            <th className="py-3 px-6">Quantidade</th>
            <th className="py-3 px-6">Nível de Estoque</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6 text-center">Ações</th>
            </tr>
        </thead>

        <tbody>
            {pageItems.map((p) => {
            const { capacity, percent, status } = p.stockInfo;

            return (
                <tr key={p.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium">{p.name}</td>
                <td className="py-3 px-6">
                    {p.category?.name ?? "Sem categoria"}
                </td>

                <td className="py-3 px-6 font-semibold">
                    {p.in_stock}
                    <div className="text-xs text-gray-500">
                    Min: {p.minimum_stock} | Capacidade: {capacity}
                    </div>
                </td>

                <td className="py-3 px-6">
                    <div className="w-full h-2 bg-gray-200 rounded-lg overflow-hidden">
                    <div
                        className="h-full bg-orange-500"
                        style={{ width: `${percent}%` }}
                    ></div>
                    </div>
                    <span className="text-xs text-gray-600">
                    {percent}% da capacidade
                    </span>
                </td>

                <td className="py-3 px-6">
                    <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        status === "Crítico"
                        ? "bg-red-100 text-red-700"
                        : status === "Baixo"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                    >
                    {status}
                    </span>
                </td>

                <td className="py-3 px-6 text-center">
                    <button
                    onClick={() => {
                        setModalType("editar");
                        setSelectedProduct(p);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                    >
                    <Pencil className="w-4 h-4" />
                    </button>
                </td>
                </tr>
            );
            })}
        </tbody>
        </table>
    </div>

    {/* Paginação */}
    <div className="flex justify-center mt-6 gap-2 items-center">
        <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-100 rounded disabled:bg-gray-300"
        >
        &laquo; Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter(
            (page) =>
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
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded ${
                    currentPage === page
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
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 bg-gray-100 rounded disabled:bg-gray-300"
        >
        Próximo &raquo;
        </button>
    </div>

    {/* MODAL */}
    {modalType && (
        <EstoqueFormModal
        type={modalType}
        product={selectedProduct}
        onClose={() => setModalType(null)}
        onUpdated={load} 
        />
    )}

    
    </div>

    
);
}
