import React from "react";
import { X, Target, Calendar, Clipboard, Box } from "lucide-react";

interface Props {
  campanha: any;
  onClose: () => void;
}

export default function CampanhaDetalhesModal({ campanha, onClose }: Props) {
  const meta = campanha.goal_amount ?? campanha.goal_quantity ?? 0;
  const arrecadado = 0; // backend ainda não tem
  const progresso = meta > 0 ? Math.round((arrecadado / meta) * 100) : 0;

  const statusLabel = campanha.is_active ? "Ativa" : "Inativa";

  const statusColors: Record<string, { bg: string; text: string }> = {
    Ativa: { bg: "bg-green-100", text: "text-green-700" },
    Inativa: { bg: "bg-red-100", text: "text-red-700" },
  };

  const statusColor = statusColors[statusLabel];

  const items = campanha.items || []; // caso existam itens associados

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {campanha.name}
            </h3>
            <p className="text-xs text-gray-500">
              {campanha.description || "Sem descrição"}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* STATUS */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="text-orange-500 w-5 h-5" />
            <span className="font-medium">Status:</span>
          </div>
          <span
            className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor.bg} ${statusColor.text}`}
          >
            {statusLabel}
          </span>
        </div>

        {/* METAS */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500">Meta</p>
            <p className="text-xl font-semibold">{meta}</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 border">
            <p className="text-xs text-gray-500">Arrecadado</p>
            <p className="text-xl font-semibold">{arrecadado}</p>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 mb-1">Progresso</p>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div
              className="h-2 bg-orange-500 rounded-full"
              style={{ width: `${progresso}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">{progresso}% da meta</p>
        </div>

        {/* DATAS */}
        <div className="space-y-3 mb-6 text-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Início:</span>
            </div>
            <span>{campanha.start_date}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Fim:</span>
            </div>
            <span>{campanha.end_date || "Indefinido"}</span>
          </div>
        </div>

        {/* ITENS ASSOCIADOS */}
        <div className="border rounded-lg p-4 mb-6 bg-gray-50">
          <p className="text-sm font-medium mb-2 flex items-center gap-2">
            <Box className="text-orange-500 w-4 h-4" />
            Itens da campanha
          </p>

          <div className="space-y-2">
            {items.length > 0 ? (
              items.map((it, i) => (
                <div
                  key={i}
                  className="flex justify-between bg-white p-2 rounded-md border"
                >
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">
                    {it.quantity ?? "-"}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">
                Nenhum item associado a esta campanha.
              </p>
            )}
          </div>
        </div>

        {/* OBSERVAÇÕES */}
        <div className="flex items-start gap-2 mb-6">
          <Clipboard className="text-orange-500 w-5 h-5" />
          <div>
            <p className="font-medium">Observações:</p>
            <p className="text-sm text-gray-600">
              {campanha.observations || "Nenhuma observação registrada."}
            </p>
          </div>
        </div>

        {/* FOOTER */}
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
