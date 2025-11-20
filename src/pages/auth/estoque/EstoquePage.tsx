import { useState } from "react";
import { Package, AlertTriangle, Layers, TrendingUp, Search, Pencil } from "lucide-react";

export function EstoquePage() {
const [searchTerm, setSearchTerm] = useState("");
const [categoryFilter, setCategoryFilter] = useState("Todas as categorias");
const [statusFilter, setStatusFilter] = useState("Todos os status");

// Dados simulados
const produtos = [
    {
    nome: "Arroz Branco 5kg",
    categoria: "Grãos",
    quantidade: "150 pacotes",
    nivel: 75,
    validade: "30/12/2024",
    diasRestantes: -327,
    localizacao: "Setor A1",
    status: "Normal",
    },
    {
    nome: "Feijão Preto 1kg",
    categoria: "Grãos",
    quantidade: "25 pacotes",
    nivel: 25,
    validade: "29/11/2024",
    diasRestantes: -268,
    localizacao: "Setor A2",
    status: "Baixo",
    },
    {
    nome: "Óleo de Soja 900ml",
    categoria: "Enlatados",
    quantidade: "80 unidades",
    nivel: 67,
    validade: "14/10/2024",
    diasRestantes: -314,
    localizacao: "Setor B1",
    status: "Normal",
    },
    {
    nome: "Sabonete",
    categoria: "Higiene",
    quantidade: "15 unidades",
    nivel: 25,
    validade: "29/06/2025",
    diasRestantes: -56,
    localizacao: "Setor C1",
    status: "Baixo",
    },
];

const filtered = produtos.filter((p) =>
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
);

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
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 cursor-pointer text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors">
        + Entrada Manual
        </button>
    </div>

    {/* Cards de resumo */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Total de Itens</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">4</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-full">
            <Package className="text-blue-500 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Estoque Baixo</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">2</p>
        </div>
        <div className="bg-red-50 p-4 rounded-full">
            <AlertTriangle className="text-red-500 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Vencendo</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">4</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-full">
            <AlertTriangle className="text-yellow-500 w-7 h-7" />
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
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
        >
            <option>Todas as categorias</option>
            <option>Grãos</option>
            <option>Enlatados</option>
            <option>Higiene</option>
        </select>

        <select
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none bg-white"
        >
            <option>Todos os status</option>
            <option>Normal</option>
            <option>Baixo</option>
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
            <th className="py-3 px-6">Validade</th>
            <th className="py-3 px-6">Localização</th>
            <th className="py-3 px-6">Status</th>
            <th className="py-3 px-6 text-center">Ações</th>
            </tr>
        </thead>
        <tbody>
            {filtered.map((p, i) => (
            <tr key={i} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium text-gray-800">
                {p.nome}
                <div className="text-xs text-gray-400">
                    Última movimentação: 14/01/2024
                </div>
                </td>
                <td className="py-3 px-6">{p.categoria}</td>
                <td className="py-3 px-6">{p.quantidade}</td>
                <td className="py-3 px-6">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                    className={`h-2.5 rounded-full ${
                        p.nivel < 30
                        ? "bg-red-400"
                        : p.nivel < 60
                        ? "bg-yellow-400"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${p.nivel}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                    {p.nivel}% da capacidade
                </p>
                </td>
                <td className="py-3 px-6">
                <div>{p.validade}</div>
                <div className="flex items-center gap-1 text-xs text-yellow-600">
                    <AlertTriangle className="text-yellow-600 w-4 h-4" /> {p.diasRestantes} dias
                </div>
                </td>
                <td className="py-3 px-6">{p.localizacao}</td>
                <td className="py-3 px-6">
                <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    p.status === "Baixo"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                >
                    {p.status}
                </span>
                </td>
                <td className="py-3 px-6 text-center">
                <button className="p-2 text-blue-500 hover:text-blue-700 cursor-pointer transition">
                    <Pencil className="w-4 h-4" />
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>
    </div>
);
}
