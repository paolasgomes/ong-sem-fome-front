import { useState, useEffect } from "react";
import { Target, CalendarDays, TrendingUp, Plus } from "lucide-react";
import { getCampaigns, updateCampaign, getCampaignById } from "../../../services/apiCampaigns";
import CampanhaForm from "./CampanhaForm";
import CampanhaDetalhesModal from "./CampanhaDetalhesModal";
import type { Campaign } from "../../../types/Campanha";

export default function CampanhasPage() {
  const [campanhas, setCampanhas] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedCampanha, setSelectedCampanha] = useState<Campaign | null>(null);

  // ================== LOAD CAMPAIGNS ==================
  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const res = await getCampaigns({ page: 1, limit: 100 });

      const formatted = (res.results ?? []).map((c) => ({
        ...c,
        description: c.description ?? null,
        donated_quantity: (c as any).donated_quantity ?? 0,
      }));

      setCampanhas(formatted);
    } catch (err) {
      console.error("Erro ao carregar campanhas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // ================== FORMATAÇÃO DE NÚMEROS GRANDES ==================
  const formatLargeNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    return Math.round(num).toString();
  };

  // ================== METRICS ==================
  const totalMeta = campanhas.reduce(
    (a, c) => a + (c.goal_amount ?? c.goal_quantity ?? 0),
    0
  );

  const totalArrecadado = campanhas.reduce(
    (a, c) => a + (c.donated_quantity ?? 0),
    0
  );

  const campanhasAtivas = campanhas.filter((c) => c.is_active).length;
  const porcentagemMeta = totalMeta > 0 ? Math.round((totalArrecadado / totalMeta) * 100) : 0;

  // ================== FUNÇÃO CONCLUIR CAMPANHA ==================
  const concluirCampanha = async (camp: Campaign) => {
    try {
      const original = await getCampaignById(camp.id);

      const payload = {
        ...original,
        is_active: false,
        description: `${original.description || ""} - Concluída em ${new Date().toLocaleDateString()}`,
      };

      await updateCampaign(camp.id, payload);

      alert(`Campanha "${camp.name}" concluída!`);

      setCampanhas((prev) =>
        prev.map((c) =>
          c.id === camp.id ? { ...c, is_active: false, description: payload.description } : c
        )
      );
    } catch (err) {
      console.error("Erro ao concluir campanha", err);
      alert("Não foi possível concluir a campanha. Tente novamente.");
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("pt-BR");
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen text-gray-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Campanhas</h1>
          <p className="text-gray-500 text-sm mt-1">
            Gestão de períodos, metas e produtos específicos
          </p>
        </div>

        <button
          onClick={() => setOpenForm(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
        >
          <Plus className="w-4 h-4" /> Nova Campanha
        </button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-sm flex flex-col justify-between">
          <p className="text-xs text-gray-500">Campanhas Ativas</p>
          <p className="text-3xl font-bold text-gray-800 mt-1 truncate break-words">
            {formatLargeNumber(campanhasAtivas)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex-1 pr-2">
            <p className="text-xs text-gray-500">Meta Total</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 truncate break-words">
              {formatLargeNumber(totalMeta)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-full shrink-0">
            <Target className="text-green-500 w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex-1 pr-2">
            <p className="text-xs text-gray-500">Arrecadado</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 truncate break-words">
              {formatLargeNumber(totalArrecadado)}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-full shrink-0">
            <TrendingUp className="text-purple-500 w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex justify-between items-center">
          <div className="flex-1 pr-2">
            <p className="text-xs text-gray-500">% da Meta</p>
            <p className="text-3xl font-bold text-gray-800 mt-1 truncate break-words">
              {formatLargeNumber(porcentagemMeta)}%
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full shrink-0">
            <CalendarDays className="text-orange-500 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Lista de Campanhas */}
      {loading ? (
        <p className="text-center text-gray-500">Carregando campanhas...</p>
      ) : campanhas.length === 0 ? (
        <p className="text-center text-gray-500">Nenhuma campanha cadastrada ainda.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campanhas.map((camp) => {
            const meta = camp.goal_amount ?? camp.goal_quantity ?? 0;
            const progresso = meta > 0 ? Math.round(((camp.donated_quantity ?? 0) / meta) * 100) : 0;

            return (
              <div
                key={camp.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col justify-between"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1 pr-2">
                    <h2 className="text-lg font-semibold text-gray-800">{camp.name}</h2>
                    <p className="text-sm text-gray-500 break-words">
                      {camp.description || "Sem descrição"}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                      camp.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                    }`}
                  >
                    {camp.is_active ? "Ativa" : "Concluída"}
                  </span>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="h-2 bg-orange-500 rounded-full transition-all"
                      style={{ width: `${progresso}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{progresso}% da meta atingida</p>
                </div>

                {/* Datas */}
                <div className="flex justify-between text-sm text-gray-600 mb-4 break-words">
                  <p>
                    <span className="font-medium text-gray-800">Início:</span> {formatDate(camp.start_date)}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Fim:</span> {formatDate(camp.end_date)}
                  </p>
                </div>

                {/* Botões */}
                <div className="flex justify-end gap-2 mt-auto flex-wrap">
                  <button
                    onClick={() => setSelectedCampanha(camp)}
                    className="px-3 py-1 border border-blue-500 text-blue-500 hover:text-blue-700 text-sm font-medium rounded-lg transition"
                  >
                    Ver Detalhes
                  </button>

                  {camp.is_active && (
                    <button
                      onClick={() => concluirCampanha(camp)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition"
                    >
                      Concluir Campanha
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Form */}
      <CampanhaForm open={openForm} onClose={() => setOpenForm(false)} onCreated={loadCampaigns} />

      {/* Modal Detalhes */}
      {selectedCampanha && (
        <CampanhaDetalhesModal
          campanha={selectedCampanha}
          onClose={() => {
            setSelectedCampanha(null);
            loadCampaigns();
          }}
          onUpdated={loadCampaigns}
        />
      )}
    </div>
  );
}
