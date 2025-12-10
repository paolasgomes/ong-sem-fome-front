import { useState, useEffect } from "react";
import { Target, CalendarDays, TrendingUp, Plus } from "lucide-react";
import { getCampaigns } from "../../../services/apiCampaigns";
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
      setCampanhas(res.results);
    } catch (err) {
      console.error("Erro ao carregar campanhas", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // ================== METRICS ==================
  const totalMeta = campanhas.reduce(
    (a, c) => a + (c.goal_amount ?? c.goal_quantity ?? 0),
    0
  );

  const totalArrecadado = 0;
  const campanhasAtivas = campanhas.length;

  const porcentagemMeta =
    totalMeta > 0 ? Math.round((totalArrecadado / totalMeta) * 100) : 0;

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
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Campanhas Ativas</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {campanhasAtivas}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Meta Total</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{totalMeta}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-full">
            <Target className="text-green-500 w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">Arrecadado</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {totalArrecadado}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-full">
            <TrendingUp className="text-purple-500 w-7 h-7" />
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500">% da Meta</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">
              {porcentagemMeta}%
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full">
            <CalendarDays className="text-orange-500 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Lista de Campanhas */}
      {loading ? (
        <p className="text-center text-gray-500">Carregando campanhas...</p>
      ) : campanhas.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhuma campanha cadastrada ainda.
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campanhas.map((camp) => {
            const meta = camp.goal_amount ?? camp.goal_quantity ?? 0;
            const arrecadado = 0;
            const progresso =
              meta > 0 ? Math.round((arrecadado / meta) * 100) : 0;

            return (
              <div
                key={camp.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {camp.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {camp.description || "Sem descrição"}
                    </p>
                  </div>

                  <span className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                    {camp.is_active ? "Ativa" : "Inativa"}
                  </span>
                </div>

                {/* Barra de progresso */}
                <div className="w-full bg-gray-200 h-2 rounded-full mb-3">
                  <div
                    className="h-2 bg-orange-500 rounded-full"
                    style={{ width: `${progresso}%` }}
                  ></div>
                </div>

                <p className="text-xs text-gray-500 mb-4">
                  {progresso}% da meta atingida
                </p>

                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <p>
                    <span className="font-medium text-gray-800">Início:</span>{" "}
                    {camp.start_date}
                  </p>
                  <p>
                    <span className="font-medium text-gray-800">Fim:</span>{" "}
                    {camp.end_date || "Indefinido"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCampanha(camp)}
                  className="text-blue-500 hover:text-blue-700 text-sm font-medium transition"
                >
                  Ver Detalhes
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal do Formulário */}
      <CampanhaForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onCreated={loadCampaigns}
      />

      {/* MODAL DE DETALHES */}
      {selectedCampanha && (
        <CampanhaDetalhesModal
          campanha={selectedCampanha}
          onClose={() => setSelectedCampanha(null)}
        />
      )}
    </div>
  );
}
