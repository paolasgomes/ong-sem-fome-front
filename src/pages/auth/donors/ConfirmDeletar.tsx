import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
  donorName: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmationModal({ donorName, onClose, onConfirm }: DeleteConfirmationModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-[95%] max-w-sm text-center transform transition-all scale-100">
        <div className="flex justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Trash2 className="w-6 h-6 text-red-600" />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Confirmar Exclusão</h2>
        <p className="text-gray-600 mb-8">Deseja realmente excluir o doador **{donorName}**? Esta ação não pode ser desfeita.</p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 font-medium transition-colors"
            aria-label="Cancelar exclusão"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            aria-label="Confirmar exclusão"
          >
            Excluir Doador
          </button>
        </div>
      </div>
    </div>
  );
}