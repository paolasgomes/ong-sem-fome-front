import { X, User, Mail, Phone, IdCard, Home, SquarePower , Users, FileText, Search } from "lucide-react";
import type { Family } from "../../../types/Family";

interface FamilyProfileCardProps {
    family: Family;
    onClose: () => void;
}

export function FamilyProfileCard({ family, onClose }: FamilyProfileCardProps) {
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

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Perfil da Família</h2>

            <div className="space-y-6 text-sm text-gray-700">

            {/* Seção: Responsável */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                <User className="text-orange-500 w-5 h-5" />
                <span className="font-medium">Responsável:</span> {family.responsible_name}
                </div>
                <div className="flex items-center gap-2">
                <IdCard className="text-orange-500 w-5 h-5" />
                <span className="font-medium">CPF:</span> {family.responsible_cpf}
                </div>
            </div>

            <hr className="border-t border-gray-200" />

            {/* Seção: Contato */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                <Mail className="text-orange-500 w-5 h-5" />
                <span className="font-medium">E-mail:</span> {family.email}
                </div>
                <div className="flex items-center gap-2">
                <Phone className="text-orange-500 w-5 h-5" />
                <span className="font-medium">Telefone:</span> {family.phone}
                </div>
            </div>

            <hr className="border-t border-gray-200" />

            {/* Seção: Endereço */}
            <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Home className="text-orange-500 w-5 h-5" />
                <span className="font-medium">Endereço:</span>
            </div>
            <div className="ml-7 space-y-1 text-gray-700 text-sm">
                <div>{family.street_address}, {family.street_number}</div>
                <div>{family.street_neighborhood}</div>
                <div>{family.city} - {family.state}</div>
                <div>{family.zip_code}</div>
            </div>
            </div>

            <hr className="border-t border-gray-200" />

            {/* Seção: Informações adicionais */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                <Users className="text-orange-500 w-5 h-5" />
                <span className="font-medium">Membros:</span> {family.members_count}
                </div>
                <div className="flex items-center gap-2">
                <FileText className="text-orange-500 w-5 h-5" />
                <span className="font-medium">Faixa de Renda:</span> {family.income_bracket}
                </div>
                <div className="flex items-center gap-2">
                <SquarePower className="text-orange-500 w-5 h-5" />
                <span className="font-medium">Status:</span>
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    family.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                >
                    {family.is_active ? "Ativa" : "Inativa"}
                </span>

                </div>
                {family.observation && (
                <div className="flex items-center gap-2">
                    <Search className="text-orange-500 w-5 h-5" />
                    <span className="font-medium"> Observações:</span> {family.observation}
                </div>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}
