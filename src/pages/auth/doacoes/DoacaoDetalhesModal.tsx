import { X, User, FileText, Calendar, DollarSign, Box } from "lucide-react";

interface Props {
  donation: any;
  onClose: () => void;
}

export function DoacaoDetalhesModal({ donation, onClose }: Props) {
  const categoryMap: Record<string, string> = {
    food: "Alimentos",
    clothing: "Roupas",
    money: "Dinheiro",
    campaign: "Campanha",
  };

  // Criar um array de campos com label, valor e ícone
  const fields = [
    { label: "Doador", value: donation.donor?.name, icon: <User className="text-orange-500 w-5 h-5" /> },
    { label: "Categoria", value: categoryMap[donation.type], icon: <FileText className="text-orange-500 w-5 h-5" /> },
    { label: "Produto", value: donation.product?.name, icon: <Box className="text-orange-500 w-5 h-5" /> },
    { label: "Quantidade", value: donation.quantity ? `${donation.quantity} ${donation.unit}` : undefined, icon: null },
    { label: "Valor", value: donation.amount ? `R$ ${donation.amount.toFixed(2)}` : undefined, icon: <DollarSign className="text-orange-500 w-5 h-5" /> },
    { label: "Data", value: donation.created_at ? new Date(donation.created_at).toLocaleDateString() : undefined, icon: <Calendar className="text-orange-500 w-5 h-5" /> },
    { label: "Observações", value: donation.observations, icon: <FileText className="text-orange-500 w-5 h-5" /> },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-[95%] max-w-lg shadow-2xl relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Detalhes da Doação
        </h2>

        <div className="space-y-4 text-gray-700">
          {fields.map((field, idx) => {
            if (!field.value) return null; // só renderiza se tiver valor
            return (
              <div key={idx} className="flex items-center gap-2 justify-between">
                <div className="flex items-center gap-2">
                  {field.icon}
                  <span className="font-medium">{field.label}:</span>
                </div>
                <span>{field.value}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
