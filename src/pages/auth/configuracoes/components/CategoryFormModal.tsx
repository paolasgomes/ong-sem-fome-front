// CategoryFormModal.tsx
import { useEffect, useState } from "react";
import { X, Tag } from "lucide-react";
import type { ICategory } from "../../../../services/apiCategory";

interface Props {
onSave: (name: string, isPerishable: boolean) => void;
onClose: () => void;
category?: ICategory | null;
}

export function CategoryFormModal({ onSave, onClose, category }: Props) {
const [name, setName] = useState(category?.name ?? "");
const [isPerishable, setIsPerishable] = useState(category?.is_perishable ?? false);

useEffect(() => {
    if (category) {
    setName(category.name);
    setIsPerishable(category.is_perishable);
    }
}, [category]);

const handleSubmit = () => {
    if (!name.trim()) {
    alert("Preencha o nome da categoria!");
    return;
    }
    onSave(name, isPerishable);
};

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
        <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        {category ? "Editar Categoria" : "Nova Categoria"}
        </h2>

        <div className="space-y-4">
        {/* NOME */}
        <div className="relative">
            <input
            type="text"
            placeholder="Nome da categoria"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-3"
            />
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* PERECÍVEL */}
        <label className="flex items-center gap-2">
            <input
            type="checkbox"
            checked={isPerishable}
            onChange={(e) => setIsPerishable(e.target.checked)}
            className="w-4 h-4"
            />
            <span className="text-gray-700">Perecível</span>
        </label>
        </div>

        <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
        >
        {category ? "Salvar Alterações" : "Criar Categoria"}
        </button>
    </div>
    </div>
);
}
