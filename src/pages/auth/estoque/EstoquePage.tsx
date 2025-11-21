import { useState } from "react";
import { Package, AlertTriangle, Layers, Search, Pencil } from "lucide-react";
import { calculateStockInfo } from "../../../utils/stockUtils";
import { updateStock } from "../../../services/apiStock";

export function EstoquePage() {
const [searchTerm, setSearchTerm] = useState("");
const [categoryFilter, setCategoryFilter] = useState("Todas as categorias");
const [statusFilter, setStatusFilter] = useState("Todos os status");

// Modal de ENTRADA manual
const [openEntryModal, setOpenEntryModal] = useState(false);
const [selectedProductId, setSelectedProductId] = useState("");
const [entryQuantity, setEntryQuantity] = useState("");

// Modal de edição (lápis)
const [openModal, setOpenModal] = useState(false);
const [selectedProduct, setSelectedProduct] = useState<any>(null);
const [newQuantity, setNewQuantity] = useState("");

function openUpdateModal(product: any) {
    setSelectedProduct(product);
    setOpenModal(true);
}

// DADOS SIMULADOS
const produtos = [
    {
    id: 1,
    name: "Arroz Branco 5kg",
    category: "Grãos",
    in_stock: 150,
    minimum_stock: 40
    },
    {
    id: 2,
    name: "Feijão Preto 1kg",
    category: "Grãos",
    in_stock: 25,
    minimum_stock: 40
    },
    {
    id: 3,
    name: "Óleo de Soja 900ml",
    category: "Enlatados",
    in_stock: 80,
    minimum_stock: 30
    },
    {
    id: 4,
    name: "Sabonete",
    category: "Higiene",
    in_stock: 15,
    minimum_stock: 40
    }
];

// APLICA FILTROS
const filtered = produtos.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
);

// Atualização do modal de edição
async function handleUpdate() {
    try {
    const quantityNumber = Number(newQuantity);

    await updateStock(selectedProduct.id, quantityNumber);

    alert("Estoque atualizado com sucesso!");

    setOpenModal(false);
    setNewQuantity("");
    } catch (error) {
    alert("Erro ao atualizar o estoque");
    }
}

// Entrada manual
async function handleManualEntry() {
    if (!selectedProductId || !entryQuantity) {
    alert("Selecione o produto e quantidade.");
    return;
    }

    try {
    await updateStock(Number(selectedProductId), Number(entryQuantity));

    alert("Entrada registrada com sucesso!");

    setOpenEntryModal(false);
    setEntryQuantity("");
    setSelectedProductId("");
    } catch (error) {
    alert("Erro ao registrar entrada manual");
    }
}

// RENDER
return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Estoque</h1>
        <p className="text-gray-500 text-sm mt-2">
            Controle de produtos por categorias
        </p>
        </div>

        <button
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        onClick={() => setOpenEntryModal(true)}
        >
        + Entrada Manual
        </button>
    </div>

    {/* Cards de resumo */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Total de Itens</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">
            {produtos.length}
            </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-full">
            <Package className="text-blue-500 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Estoque Baixo</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">
            {produtos.filter((p) => calculateStockInfo(p).status !== "Normal").length}
            </p>
        </div>
        <div className="bg-red-50 p-4 rounded-full">
            <AlertTriangle className="text-red-500 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Categorias</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">5</p>
        </div>
        <div className="bg-green-50 p-4 rounded-full">
            <Layers className="text-green-500 w-7 h-7" />
        </div>
        </div>
    </div>

    {/* Filtros */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-1/2">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
            type="text"
            placeholder="Buscar produtos..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
        <select
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        >
            <option>Todas as categorias</option>
            <option>Grãos</option>
            <option>Enlatados</option>
            <option>Higiene</option>
        </select>

        <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
        >
            <option>Todos os status</option>
            <option>Normal</option>
            <option>Baixo</option>
            <option>Crítico</option>
        </select>
        </div>
    </div>

    {/* Tabela */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
            <th className="py-3 px-6">Produto</th>
            <th className="py-3 px-6">Categoria</th>
            <th className="py-3 px-6">Quantidade</th>
            <th className="py-3 px-6">Nível do Estoque</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6 text-center">Ações</th>
            </tr>
        </thead>

        <tbody>
            {filtered.map((p, i) => {
            const stock = calculateStockInfo(p);

            return (
                <tr key={i} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium text-gray-800">
                    {p.name}
                    <div className="text-xs text-gray-400">
                    Última movimentação: 14/01/2024
                    </div>
                </td>

                <td className="py-3 px-6">{p.category}</td>

                <td className="py-3 px-6">{p.in_stock} un.</td>

                <td className="py-3 px-6">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className={`
                            h-2.5 rounded-full 
                            ${stock.status === "Crítico" ? "bg-red-500" : ""}
                            ${stock.status === "Baixo" ? "bg-yellow-400" : ""}
                            ${stock.status === "Normal" ? "bg-green-500" : ""}
                        `}
                        style={{ width: `${stock.percent}%` }}
                    ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                    {stock.percent}% da capacidade
                    </p>
                </td>

                <td className="py-3 px-6">
                    <span
                    className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${
                        stock.status === "Crítico"
                            ? "bg-red-100 text-red-700"
                            : stock.status === "Baixo"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }
                    `}
                    >
                    {stock.status}
                    </span>
                </td>

                <td className="py-3 px-6 text-center">
                    <button
                    className="p-2 text-blue-500 hover:text-blue-700 transition"
                    onClick={() => openUpdateModal(p)}
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

    {/* MODAL: Entrada Manual */}
    {openEntryModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Entrada Manual</h2>

            <label className="text-sm font-medium">Produto</label>
            <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
            >
            <option value="">Selecione...</option>
            {produtos.map((p) => (
                <option key={p.id} value={p.id}>
                {p.name}
                </option>
            ))}
            </select>

            <label className="text-sm font-medium">
            Quantidade de entrada
            </label>
            <input
            type="number"
            value={entryQuantity}
            onChange={(e) => setEntryQuantity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
            placeholder="Ex: 20"
            />

            <div className="flex justify-end gap-3">
            <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setOpenEntryModal(false)}
            >
                Cancelar
            </button>

            <button
                className="px-4 py-2 bg-orange-500 text-white rounded-lg"
                onClick={handleManualEntry}
            >
                Confirmar
            </button>
            </div>
        </div>
        </div>
    )}

    {/* MODAL: Editar quantidade (botão lápis) */}
    {openModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
            Atualizar estoque de {selectedProduct.name}
            </h2>

            <label className="text-sm font-medium">Novo estoque</label>
            <input
            type="number"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 mb-4"
            placeholder="Ex: 150"
            />

            <div className="flex justify-end gap-3">
            <button
                className="px-4 py-2 bg-gray-300 rounded-lg"
                onClick={() => setOpenModal(false)}
            >
                Cancelar
            </button>

            <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                onClick={handleUpdate}
            >
                Atualizar
            </button>
            </div>
        </div>
        </div>
    )}
    </div>
);
}
