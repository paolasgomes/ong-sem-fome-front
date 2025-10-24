import { useState, useEffect } from 'react';
import { X, User, Mail, Phone } from "lucide-react";
import type {Family} from "../../../types/Family"


interface FamilyFormModalProps {
    initialFamily: Family;
    mode: 'edit' | 'new';
    onClose: () => void;
    onSave: (family: Family, mode: 'edit' | 'new') => void;
}

// ----- Funções de validação -----
export const validateFamily = (family: Family): string | null => {
    if (!family.responsible_name || !family.email || !family.phone || !family.street_address || !family.street_number || !family.city || !family.state || !family.zip_code) {
        return 'Preencha todos os campos obrigatórios!';
    }

    if (!family.email.includes('@') || family.email.length < 5) {
        return 'E-mail inválido!';
    }

    if (!family.phone.match(/^\(\d{2}\)\s*\d{4,5}-\d{4}$/)) {
        return 'Telefone inválido! Use o formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.';
    }

    if (!family.responsible_cpf || !family.responsible_cpf.match(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)) {
        return 'CPF inválido! Deve conter 11 números no formato 000.000.000-00.';
    }

    return null;
};

// ----- Funções de máscara -----
const formatCPF = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 14); // 123.456.789-10
    return v
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, '').slice(0, 11);
    if (v.length <= 10) {
        return v.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
};

// ----- Componente DonorFormModal -----
export function FamilyFormModal({ initialFamily, mode, onClose, onSave }: FamilyFormModalProps) {
    const [familyData, setFamilyData] = useState<Family>({
        ...initialFamily,
        //members_count: initialFamily.members_count || 0,
        //members_count: initialFamily.members_count || ""
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setFamilyData({
        ...initialFamily,
        members_count: initialFamily.members_count || 0,
        //lastDonation: initialFamily.lastDonation || ""
        });
    }, [initialFamily]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFamilyData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const validationError = validateFamily(familyData);
        if (validationError) {
        setError(validationError);
        return;
        }
        setError(null);
        onSave(familyData, mode);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 w-[95%] max-w-lg shadow-2xl relative transform transition-all scale-100 overflow-y-auto max-h-[90vh]">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition" aria-label="Fechar modal">
            <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            {mode === 'edit' ? "Editar Família" : "Cadastrar Nova Família"}
            </h2>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="space-y-4">
                {/* Nome / Razão Social */}
                <div className="relative">
                    <input
                    type="text"
                    name="responsible_name"
                    placeholder="Nome do Responsável"
                    value={familyData.responsible_name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
                    />
                </div>

                {/* CPF (PF) */}
                <div className="relative">
                    <input
                    type="text"
                    name="responsible_cpf"
                    placeholder="CPF"
                    value={familyData.responsible_cpf}
                    onChange={(e) => setFamilyData(prev => ({ ...prev, responsible_cpf: formatCPF(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* E-mail */}
                <div className="relative">
                    <input
                    type="email"
                    name="email"
                    placeholder="E-mail"
                    value={familyData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Telefone */}
                <div className="relative">
                    <input
                    type="text"
                    name="phone"
                    placeholder="Telefone (Ex: (11) 99999-9999)"
                    value={familyData.phone}
                    onChange={(e) => setFamilyData(prev => ({ ...prev, phone: formatPhone(e.target.value) }))}
                    className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>

                {/* Endereço e demais campos */}
                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="street_address" placeholder="Rua" value={familyData.street_address} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                    <input type="text" name="street_number" placeholder="Número" value={familyData.street_number} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input type="text" name="street_complement" placeholder="Complemento" value={familyData.street_complement || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                    <input type="text" name="street_neighborhood" placeholder="Bairro" value={familyData.street_neighborhood} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <input type="text" name="city" placeholder="Cidade" value={familyData.city} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                    <input type="text" name="state" placeholder="Estado" value={familyData.state} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                    <input type="text" name="zip_code" placeholder="CEP" value={familyData.zip_code} onChange={handleChange} className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none" />
                </div>

                {/* Quantidade de membros */}
                <div className="relative">
                    <input
                        type="number"
                        name="members_count"
                        placeholder="Quantidade de Membros"
                        value={familyData.members_count}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        />
                </div>

                {/* Faixa de renda */}
                <div className="relative">
                    <input
                        type="text"
                        name="income_bracket"
                        placeholder="Faixa de Renda"
                        value={familyData.income_bracket}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        />
                </div>

                {/* Endereço completo (campo "address" do back) */}
                <div className="relative">
                    <input
                        type="text"
                        name="address"
                        placeholder="Endereço Completo"
                        value={familyData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        />
                </div>

                {/* Observação */}
                <div className="relative">
                    <textarea
                        name="observation"
                        placeholder="Observações"
                        value={familyData.observation}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                    />
                </div>

                {/* Status Ativo/Inativo */}
                <div className="relative">
                    <select
                        name="is_active"
                        value={familyData.is_active ? 'true' : 'false'}
                        onChange={(e) => setFamilyData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                        >
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                    </select>
                </div>

            </div>

            <button onClick={handleSubmit} className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg">
            {mode === 'edit' ? "Salvar Alterações" : "Cadastrar Família"}
            </button>
        </div>
        </div>
    );
}
