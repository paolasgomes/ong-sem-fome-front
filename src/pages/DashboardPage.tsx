// DashboardPage atualizado com gráficos reais de Doações vs Saídas
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getCategories } from "../services/apiCategory";
import { getProducts } from "../services/apiProducts";
import { getDonations } from "../services/apiDoacoes";
import { getFoodBaskets } from "../services/apiCestas";

import { Heart, Package, ShoppingCart } from "lucide-react";

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
    const navigate = useNavigate();

    const [categorias, setCategorias] = useState<any[]>([]);
    const [produtos, setProdutos] = useState<any[]>([]);
    const [doacoes, setDoacoes] = useState<any[]>([]);
    const [cestas, setCestas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [dadosResumo, setDadosResumo] = useState({
        doacoesMes: 0,
        itensEstoque: 0,
        cestasMes: 0,
    });

    const palette = ["#F47A20", "#12A9B3", "#1976D2", "#7E57C2", "#7CB342"];

    function obterUltimos6Meses() {
        const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
        const hoje = new Date();
        const lista = [];

        for (let i = 5; i >= 0; i--) {
            const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
            lista.push({
                key: `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, "0")}`,
                nome: `${meses[data.getMonth()]}`,
            });
        }
        return lista;
    }

    useEffect(() => {
        async function carregar() {
            const categoriasResponse = await getCategories();
            const produtosResponse = await getProducts(1, 9999);
            const doacoesResponse = await getDonations(1, 9999);
            const cestasResponse = await getFoodBaskets(1, 9999);

            const listaProdutos = produtosResponse.results || [];
            const listaDoacoes = doacoesResponse.results || [];
            const listaCestas = cestasResponse.results || [];

            setCategorias(categoriasResponse.results || []);
            setProdutos(listaProdutos);
            setDoacoes(listaDoacoes);
            setCestas(listaCestas);

            // ---- CÁLCULOS DO RESUMO ----
            const mesAtual = new Date().toISOString().slice(0, 7); // "2025-12"

            const totalDoacoesMes = listaDoacoes.filter(
                (d: any) => d.created_at?.startsWith(mesAtual)
            ).length;

            const totalEstoque = listaProdutos.reduce(
                (sum: number, p: any) => sum + (p.in_stock || 0),
                0
            );

            const totalCestasMes = listaCestas.filter(
                (c: any) => c.created_at?.startsWith(mesAtual)
            ).length;

            setDadosResumo({
                doacoesMes: totalDoacoesMes,
                itensEstoque: totalEstoque,
                cestasMes: totalCestasMes,
            });

            setLoading(false);
        }

        carregar();
    }, []);

    // -------- GRÁFICO ENTRADAS (DOAÇÕES) vs SAÍDAS (CESTAS) --------
    const meses = obterUltimos6Meses();

    const entradasVsSaidasReais = meses.map((m) => {
        const anoMes = m.key;

        const entradas = doacoes.filter((d: any) =>
            d.created_at?.startsWith(anoMes)
        ).length;

        const saidas = cestas.filter(
            (c: any) => c.created_at?.startsWith(anoMes)
        ).length;

        return {
            mes: m.nome,
            entradas,
            saidas,
        };
    });

    // -------- GRÁFICO DE CATEGORIAS --------
    const distribQuantidades = categorias.map((cat: any, index: number) => ({
        nome: cat.name,
        quantidade: produtos.filter((p: any) => p.category?.id === cat.id).length,
        cor: palette[index % palette.length],
    }));

    const totalProdutos = distribQuantidades.reduce((sum, item) => sum + item.quantidade, 0);

    const distribuicaoCategoria = distribQuantidades
        .map((item) => ({
            nome: item.nome,
            valor: totalProdutos > 0 ? Number(((item.quantidade / totalProdutos) * 100).toFixed(2)) : 0,
            cor: item.cor,
        }))
        .filter((item) => item.valor > 0);

    return (
        <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
                    <p className="text-gray-500 text-sm mt-2">
                        Bem-vindo(a) à sua área administrativa!
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate("/dashboard/estoque")}
                        className="bg-white border border-gray-200 rounded-lg px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                    >
                        Ver Estoque
                    </button>

                    <button
                        onClick={() => navigate("/dashboard/doacoes")}
                        className="bg-orange-500 text-white rounded-lg px-6 py-2.5 text-sm hover:bg-orange-600 transition cursor-pointer"
                    >
                        Ver Doações
                    </button>
                </div>
            </div>

            {loading && <p className="text-gray-600 text-sm">Carregando dados...</p>}

            {!loading && (
                <>
                    {/* CARDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Doações (mês)</p>
                                <p className="text-2xl font-semibold mt-1 text-gray-800">
                                    {dadosResumo.doacoesMes}
                                </p>
                            </div>
                            <div className="bg-orange-50 p-2 rounded-full">
                                <Heart className="text-orange-500 w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Itens em Estoque</p>
                                <p className="text-2xl font-semibold mt-1 text-gray-800">
                                    {dadosResumo.itensEstoque.toLocaleString("pt-BR")}
                                </p>
                            </div>
                            <div className="bg-yellow-50 p-2 rounded-full">
                                <Package className="text-yellow-500 w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-gray-500">Cestas (mês)</p>
                                <p className="text-2xl font-semibold mt-1 text-gray-800">
                                    {dadosResumo.cestasMes}
                                </p>
                            </div>
                            <div className="bg-green-50 p-2 rounded-full">
                                <ShoppingCart className="text-green-500 w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* GRÁFICOS */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Entradas vs Saídas reais */}
                        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                                Entradas vs Saídas (Últimos 6 Meses)
                            </h3>

                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={entradasVsSaidasReais}>
                                    <XAxis dataKey="mes" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="entradas" fill="#12A9B3" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="saidas" fill="#F47A20" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Distribuição por categoria */}
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
                                        outerRadius={80}
                                        label={({ name, value }) => `${name}: ${value}%`}
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
                </>
            )}
        </div>
    );
}
