import { useState } from "react";
import {
Heart,
Package,
ShoppingCart,
Megaphone,
DollarSign,
} from "lucide-react";
import {
BarChart,
Bar,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer,
PieChart,
Pie,
Cell,
Legend,
} from "recharts";

export function DashboardPage() {
const [dadosResumo] = useState({
    doacoesMes: 165,
    itensEstoque: 8432,
    cestasMes: 125,
    campanhasAtivas: 2,
    entradas: 2500,
});

const entradasVsSaidas = [
    { mes: "Jan", entradas: 120, saidas: 80 },
    { mes: "Fev", entradas: 150, saidas: 100 },
    { mes: "Mar", entradas: 180, saidas: 110 },
    { mes: "Abr", entradas: 140, saidas: 90 },
    { mes: "Mai", entradas: 200, saidas: 120 },
    { mes: "Jun", entradas: 160, saidas: 100 },
];

const distribuicaoCategoria = [
    { nome: "Grãos", valor: 35, cor: "#F97316" },
    { nome: "Enlatados", valor: 25, cor: "#06B6D4" },
    { nome: "Higiene", valor: 20, cor: "#6366F1" },
    { nome: "Limpeza", valor: 12, cor: "#22C55E" },
    { nome: "Perecíveis", valor: 8, cor: "#FACC15" },
];

return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
    {/* Cabeçalho */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-2">
            Bem-vindo(a) à sua área administrativa!
        </p>
        </div>

        <div className="flex gap-2">
        <button className="bg-white border border-gray-200 rounded-lg px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition">
            Ver Estoque
        </button>
        <button className="bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm hover:bg-orange-600 transition">
            Nova Doação
        </button>
        </div>
    </div>

    {/* Cards compactos */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Doações */}
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500">Doações (mês)</p>
            <p className="text-2xl font-semibold mt-1 text-gray-800">
            {dadosResumo.doacoesMes}
            </p>
            <p className="text-green-600 text-[12px] mt-1">↑ +12% vs anterior</p>
        </div>
        <div className="bg-orange-50 p-2 rounded-full">
            <Heart className="text-orange-500 w-5 h-5" />
        </div>
        </div>

        {/* Itens em Estoque */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500">Itens em Estoque</p>
            <p className="text-2xl font-semibold mt-1 text-gray-800">
            {dadosResumo.itensEstoque.toLocaleString("pt-BR")}
            </p>
            <p className="text-yellow-600 text-[12px] mt-1">⚠ 23 itens baixos</p>
        </div>
        <div className="bg-yellow-50 p-2 rounded-full">
            <Package className="text-yellow-500 w-5 h-5" />
        </div>
        </div>

        {/* Cestas */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500">Cestas (mês)</p>
            <p className="text-2xl font-semibold mt-1 text-gray-800">
            {dadosResumo.cestasMes}
            </p>
            <p className="text-green-600 text-[12px] mt-1">↑ +15% vs anterior</p>
        </div>
        <div className="bg-green-50 p-2 rounded-full">
            <ShoppingCart className="text-green-500 w-5 h-5" />
        </div>
        </div>

        {/* Campanhas */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500">Campanhas Ativas</p>
            <p className="text-2xl font-semibold mt-1 text-gray-800">
            {dadosResumo.campanhasAtivas}
            </p>
            <p className="text-gray-500 text-[12px] mt-1">
            Natal Solidário ativa
            </p>
        </div>
        <div className="bg-orange-50 p-2 rounded-full">
            <Megaphone className="text-orange-500 w-5 h-5" />
        </div>
        </div>

        {/* Entradas */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-xs text-gray-500">Entradas ($)</p>
            <p className="text-2xl font-semibold mt-1 text-gray-800">
            R$ {dadosResumo.entradas.toLocaleString("pt-BR")}
            </p>
            <p className="text-gray-500 text-[12px] mt-1">Este mês</p>
        </div>
        <div className="bg-green-50 p-2 rounded-full">
            <DollarSign className="text-green-500 w-5 h-5" />
        </div>
        </div>
    </div>

    {/* Gráficos */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Entradas vs Saídas (Últimos 6 Meses)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={entradasVsSaidas}>
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="entradas" fill="#06B6D4" radius={[4, 4, 0, 0]} />
            <Bar dataKey="saidas" fill="#F97316" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Distribuição por Categoria
        </h3>
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                data={distribuicaoCategoria}
                dataKey="valor"
                nameKey="nome"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
            >
                {distribuicaoCategoria.map((item, index) => (
                <Cell key={index} fill={item.cor} />
                ))}
            </Pie>
            <Legend />
            <Tooltip />
            </PieChart>
        </ResponsiveContainer>
        </div>
    </div>
    </div>
);
}
