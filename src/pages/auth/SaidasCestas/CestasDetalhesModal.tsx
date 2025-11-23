import React, { useState } from "react";
import { X, User, Box, Calendar, Clipboard } from "lucide-react";
import { updateDistributionStatus } from "../../../services/apiDistribuicao";
import { updateStock } from "../../../services/apiStock";
import type { Distribution } from "../../../services/apiDistribuicao";

interface Props {
  cesta: Distribution;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

// Função para agregar itens com mesmo nome
const aggregateItems = (items: { name: string; quantity: number }[]) => {
  const map: Record<string, number> = {};
  items.forEach(item => {
    map[item.name] = (map[item.name] || 0) + item.quantity;
  });
  return Object.entries(map).map(([name, quantity]) => ({ name, quantity }));
};

export default function CestasDetalhesModal({ cesta, onClose, onStatusUpdated }: Props) {
  const [loading, setLoading] = useState(false);

  const totalItems = cesta.food_basket.items.reduce((sum, it) => sum + it.quantity, 0);

  const statusMap: Record<string, string> = {
    pending: "Pendente",
    delivered: "Enviado",
    canceled: "Cancelado",
  };
  const statusLabel = statusMap[cesta.status] ?? cesta.status;

  const statusColors: Record<string, { bg: string; text: string }> = {
    Pendente: { bg: "bg-yellow-100", text: "text-yellow-700" },
    Enviado: { bg: "bg-green-100", text: "text-green-700" },
    Cancelado: { bg: "bg-red-100", text: "text-red-700" },
  };
  const statusColor = statusColors[statusLabel] ?? { bg: "bg-gray-200", text: "text-gray-700" };

  const handleChangeStatus = async (newStatus: "delivered" | "canceled") => {
    if (cesta.status === newStatus) return;
    setLoading(true);
    try {
      // Atualiza status da distribuição
      await updateDistributionStatus(cesta.id, newStatus);

      // Se for cancelado, devolve os itens ao estoque
      if (newStatus === "canceled") {
        for (const item of cesta.food_basket.items) {
          if (item.id) {
            await updateStock(item.id, item.quantity);
          }
        }
      }

      onStatusUpdated?.();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar status ou retornar itens ao estoque:", err);
    } finally {
      setLoading(false);
    }
  };

  const aggregatedItems = aggregateItems(cesta.food_basket.items);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Detalhes da Cesta</h3>
            <p className="text-xs text-gray-500">
              {cesta.family?.responsible_name} — {cesta.family?.city}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Campos */}
        <div className="space-y-4 mb-4 text-gray-700">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Box className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Status:</span>
            </div>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor.bg} ${statusColor.text}`}>
              {statusLabel}
            </span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Data de criação:</span>
            </div>
            <span>{new Date(cesta.delivery_date).toLocaleDateString()}</span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <User className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Responsável:</span>
            </div>
            <span>{cesta.collaborator?.name || "—"}</span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Clipboard className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Observações:</span>
            </div>
            <span>{cesta.observations || "—"}</span>
          </div>

          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <Box className="text-orange-500 w-5 h-5" />
              <span className="font-medium">Total de itens:</span>
            </div>
            <span>{totalItems}</span>
          </div>
        </div>

        {/* Itens */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <p className="text-sm font-medium mb-2">Itens da cesta</p>
          <div className="space-y-2">
            {aggregatedItems.length ? (
              aggregatedItems.map((it, i) => (
                <div key={i} className="flex justify-between bg-white p-2 rounded-md border">
                  <div className="font-medium">{it.name}</div>
                  <div className="text-xs text-gray-500">{it.quantity}</div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-500">Nenhum item adicionado.</p>
            )}
          </div>
        </div>

        {/* Botões ação */}
        {cesta.status === "pending" && (
          <div className="flex gap-2">
            <button
              onClick={() => handleChangeStatus("delivered")}
              disabled={loading}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Confirmando..." : "Confirmar Entrega"}
            </button>
            <button
              onClick={() => handleChangeStatus("canceled")}
              disabled={loading}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
            >
              {loading ? "Cancelando..." : "Cancelar Entrega"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
