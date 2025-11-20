// DoacaoDetalhesModal.tsx
import { X } from "lucide-react";

interface Props {
  donation: any;
  onClose: () => void;
}

export function DoacaoDetalhesModal({ donation, onClose }: Props) {
  const categoryMap: any = {
    food: "Alimentos",
    clothing: "Roupas",
    money: "Dinheiro",
    campaign: "Campanha",
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-xl shadow-lg p-6 relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Detalhes da Doação
        </h2>

        <div className="space-y-3 text-sm">
          <p><strong>Doador:</strong> {donation.donor?.name}</p>
          <p><strong>Categoria:</strong> {categoryMap[donation.type]}</p>
          <p><strong>Produto:</strong> {donation.product?.name ?? "-"}</p>
          <p><strong>Quantidade:</strong> {donation.quantity} {donation.unit}</p>
          <p><strong>Valor:</strong> R$ {donation.amount?.toFixed(2)}</p>
          <p><strong>Data:</strong> {new Date(donation.created_at).toLocaleDateString()}</p>
          <p><strong>Observações:</strong> {donation.observations || "-"}</p>
        </div>

        {/* Botão fechar embaixo */}
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
