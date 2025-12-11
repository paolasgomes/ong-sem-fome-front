import React, { useState } from "react";
import { X, Target, Calendar, Clipboard, Box, Check } from "lucide-react";
import { getCampaignById, updateCampaign } from "../../../services/apiCampaigns";
import type { Campaign } from "../../../types/Campanha";

interface Props {
  campanha: Campaign;
  onClose: () => void;
  onUpdated?: () => void;
}

const safeUpdateCampaign = async (id: number, partial: Partial<Campaign>) => {
  const original = await getCampaignById(id);

  const basePayload: Campaign = {
    ...original,
    ...partial,
  };

  if (original.campaign_type === "money") {
    basePayload.goal_amount = Number(original.goal_amount) || 0;
    delete (basePayload as any).goal_quantity;
  } else {
    basePayload.goal_quantity = Number(original.goal_quantity) || 0;
    delete (basePayload as any).goal_amount;
  }

  return updateCampaign(id, basePayload);
};

export default function CampanhaDetalhesModal({ campanha, onClose, onUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const meta = Number(campanha.goal_amount ?? campanha.goal_quantity ?? 0);
  const arrecadado = Number((campanha as any).collected ?? 0);
  const progresso = meta > 0 ? Math.round((arrecadado / meta) * 100) : 0;

  const statusLabel = campanha.is_active ? "Ativa" : "Inativa";
  const statusColor = campanha.is_active
    ? "bg-green-100 text-green-700"
    : "bg-red-100 text-red-700";

  const formatDate = (date?: string | null) => {
    if (!date) return "Indefinido";
    return new Date(date).toLocaleDateString("pt-BR");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <header className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">{campanha.name}</h3>
            <p className="text-xs text-gray-500">{campanha.description || "Sem descrição"}</p>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </header>

        {/* STATUS */}
        <section className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="text-orange-500 w-5 h-5" />
            <span className="font-medium">Status:</span>
          </div>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor}`}>
            {statusLabel}
          </span>
        </section>

        {/* METAS */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500">Meta</p>
            <p className="text-xl font-semibold">{meta}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500">Arrecadado</p>
            <p className="text-xl font-semibold">{arrecadado}</p>
          </div>
        </section>

        {/* PROGRESS BAR */}
        <section className="mb-6">
          <p className="text-xs text-gray-500 mb-1">Progresso</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 bg-orange-500 rounded-full transition-all"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{progresso}% da meta</p>
        </section>

        {/* DATAS */}
        <section className="space-y-3 mb-6 text-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Início:</span>
            </div>
            <span>{formatDate(campanha.start_date)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Fim:</span>
            </div>
            <span>{formatDate(campanha.end_date)}</span>
          </div>
        </section>

        {/* ITENS */}
        <section className="border rounded-lg p-4 mb-6 bg-gray-50">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Box className="text-orange-500 w-4 h-4" />
            Itens da campanha
          </p>

          {Array.isArray((campanha as any).items) && (campanha as any).items.length > 0 ? (
            <ul className="text-sm text-gray-700 list-disc pl-4">
              {(campanha as any).items.map((item: any) => (
                <li key={item.id}>{item.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-500">Nenhum item informado.</p>
          )}
        </section>

        {/* OBSERVAÇÕES */}
        <section className="flex items-start gap-2 mb-6">
          <Clipboard className="text-orange-500 w-5 h-5" />
          <div>
            <p className="font-medium">Observações:</p>
            <p className="text-sm text-gray-600">
              {(campanha as any).notes || "Nenhuma observação disponível."}
            </p>
          </div>
        </section>

        {/* BOTÃO FECHAR */}
        <button
          onClick={onClose}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
