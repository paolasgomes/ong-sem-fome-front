// CestasDetalhesModal.tsx
import React from "react";
import { X } from "lucide-react";

type Product = { name: string; unit?: string };
type Item = { product: Product; quantity: number };

type Family = { name: string; address?: string };

interface FoodBasket {
  id: number;
  family: Family;
  items: Item[];
  responsible: string;
  status: string;
  created_at: string;
  observations?: string;
}

interface Props {
  cesta: FoodBasket;
  onClose: () => void;
}

export default function CestasDetalhesModal({ cesta, onClose }: Props) {
  const totalItems = cesta.items.reduce((sum, it) => sum + it.quantity, 0);

  const statusColors: Record<string, { bg: string; text: string }> = {
    Entregue: { bg: "bg-green-100", text: "text-green-700" },
    Preparando: { bg: "bg-gray-200", text: "text-gray-700" },
    Pendente: { bg: "bg-red-100", text: "text-red-700" },
  };

  const statusColor = statusColors[cesta.status] ?? { bg: "bg-gray-200", text: "text-gray-700" };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Detalhes da Cesta</h3>
            <p className="text-xs text-gray-500">{cesta.family.name} — {cesta.family.address}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Informações gerais */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-500">Responsável</p>
            <p className="font-medium">{cesta.responsible}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Data de criação</p>
            <p className="font-medium">{new Date(cesta.created_at).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Status</p>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor.bg} ${statusColor.text}`}>
              {cesta.status}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500">Total de itens</p>
            <p className="font-medium">{totalItems}</p>
          </div>
        </div>

        {/* Itens */}
        <div className="border rounded-lg p-4 mb-4 bg-gray-50">
          <p className="text-sm font-medium mb-2">Itens da cesta</p>
          <div className="space-y-2">
            {cesta.items.map((it, i) => (
              <div key={i} className="flex justify-between bg-white p-2 rounded-md border">
                <div className="font-medium">{it.product.name}</div>
                <div className="text-xs text-gray-500">
                  {it.quantity} {it.product.unit ?? ""}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Observações */}
        {cesta.observations && (
          <div className="border rounded-lg p-4 bg-gray-50">
            <p className="text-xs text-gray-500 mb-1">Observações</p>
            <p className="text-sm">{cesta.observations}</p>
          </div>
        )}
      </div>
    </div>
  );
}
