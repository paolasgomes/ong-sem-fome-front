import { useState, useEffect } from 'react';
import { X, User, Home, Users, Phone, Calendar } from "lucide-react";

interface Family {
id: number;
responsible: string;
members: number;
address: string;
phone: string;
income: number;
lastDelivery: string;
status: 'Ativa' | 'Inativa';
}

interface FamilyFormModalProps {
initialFamily: Family;
mode: 'edit' | 'new';
onClose: () => void;
onSave: (family: Family, mode: 'edit' | 'new') => void;
}

export const validateFamily = (family: Family): string | null => {
if (!family.responsible || !family.address || !family.phone) {
    return 'Preencha os campos obrigatórios: Responsável, Endereço e Telefone!';
}
if (!family.phone.match(/^\(\d{2}\)\s*\d{4,5}-\d{4}$/)) {
    return 'Telefone inválido! Use o formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.';
}
if (family.members <= 0) return 'A quantidade de membros deve ser maior que zero.';
if (family.income < 0) return 'A renda familiar não pode ser negativa.';
return null;
};

export function FamilyFormModal({ initialFamily, mode, onClose, onSave }: FamilyFormModalProps) {
const [familyData, setFamilyData] = useState<Family>(initialFamily);

useEffect(() => {
    setFamilyData(initialFamily);
}, [initialFamily]);

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFamilyData(prev => ({
    ...prev,
    [name]: name === "members" || name === "income" ? Number(value) : value
    }));
};

const handleSubmit = () => {
    const error = validateFamily(familyData);
    if (error) { alert(error); return; }
    onSave(familyData, mode);
};

return (
    // CAMADA EXTERNA: ocupa a tela toda
    <div className="fixed inset-0 z-50">
    {/* Fundo escuro */}
    <div className="absolute inset-0 bg-black/50" onClick={onClose} />

    {/* CONTAINER ROLÁVEL */}
    <div className="absolute inset-0 overflow-y-auto">
        {/* Centraliza e garante espaço de respiro mesmo com zoom */}
        <div className="min-h-full flex items-center justify-center p-4">
        {/* CONTEÚDO DO MODAL: limita a altura e permite rolar por dentro */}
        <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl
                        p-8 sm:p-8
                        max-h-[calc(100vh-2rem)] sm:max-h-[90vh] overflow-y-auto">
            <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="Fechar modal"
            >
            <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {mode === 'edit' ? "Editar Família" : "Cadastrar Nova Família"}
            </h2>

            <div className="space-y-4">
            {/* Responsável */}
            <div>
                <label htmlFor="responsible" className="block text-xs text-gray-600 font-medium mb-1">
                Responsável *
                </label>
                <div className="relative">
                <input
                    id="responsible"
                    type="text"
                    name="responsible"
                    placeholder="Nome do Responsável"
                    value={familyData.responsible}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Membros */}
            <div>
                <label htmlFor="members" className="block text-xs text-gray-600 font-medium mb-1">
                Membros *
                </label>
                <div className="relative">
                <input
                    id="members"
                    type="number"
                    name="members"
                    placeholder="Quantidade de Membros"
                    value={familyData.members}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    min={1}
                />
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Endereço */}
            <div>
                <label htmlFor="address" className="block text-xs text-gray-600 font-medium mb-1">
                Endereço *
                </label>
                <div className="relative">
                <input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Endereço Completo"
                    value={familyData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
                <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Telefone (com máscara) */}
            <div>
                <label htmlFor="phone" className="block text-xs text-gray-600 font-medium mb-1">
                Telefone *
                </label>
                <div className="relative">
                <input
                    id="phone"
                    type="text"
                    name="phone"
                    placeholder="Telefone (Ex: (11) 99999-9999)"
                    value={familyData.phone}
                    onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, "");
                    if (value.length > 11) value = value.slice(0, 11);
                    if (value.length > 6) {
                        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
                    } else if (value.length > 2) {
                        value = value.replace(/^(\d{2})(\d{0,5})/, "($1) $2");
                    } else if (value.length > 0) {
                        value = value.replace(/^(\d{0,2})/, "($1");
                    }
                    setFamilyData(prev => ({ ...prev, phone: value }));
                    }}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Renda */}
            <div>
                <label htmlFor="income" className="block text-xs text-gray-600 font-medium mb-1">
                Renda Familiar (R$)
                </label>
                <div className="relative">
                <input
                    id="income"
                    type="number"
                    name="income"
                    placeholder="Renda Familiar (R$)"
                    value={familyData.income}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    min={0}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">R$</span>
                </div>
            </div>

            {/* Última Entrega */}
            <div>
                <label htmlFor="lastDelivery" className="block text-xs text-gray-600 font-medium mb-1">
                Última Entrega
                </label>
                <div className="relative">
                <input
                    id="lastDelivery"
                    type="date"
                    name="lastDelivery"
                    value={familyData.lastDelivery ? familyData.lastDelivery.slice(0, 10) : ""}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
            </div>

            {/* Status (somente edição) */}
            {mode === 'edit' && (
                <div>
                <label htmlFor="status" className="block text-xs text-gray-600 font-medium mb-1">
                    Status
                </label>
                <div className="relative">
                    <select
                    id="status"
                    name="status"
                    value={familyData.status}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white appearance-none pr-10"
                    >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    &#9660;
                    </span>
                </div>
                </div>
            )}
            </div>

            <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
            {mode === 'edit' ? "Salvar Alterações" : "Cadastrar Família"}
            </button>
        </div>
        </div>
    </div>
    </div>
);
}
