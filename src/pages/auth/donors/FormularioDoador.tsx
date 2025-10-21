import { useState, useEffect } from 'react';
import { X, User, Building2, Mail, Phone } from "lucide-react";

interface Donor {
  id?: number;
  type: 'PF' | 'PJ';
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  street_address: string;
  street_number: string;
  street_complement?: string;
  street_neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  observation?: string;
  status?: 'Ativo' | 'Inativo';
}

interface DonorFormModalProps {
  initialDonor: Donor;
  mode: 'edit' | 'new';
  onClose: () => void;
  onSave: (donor: Donor, mode: 'edit' | 'new') => void;
}

export const validateDonor = (donor: Donor): string | null => {
  if (!donor.name || !donor.email || !donor.phone || !donor.street_address || !donor.street_number || !donor.city || !donor.state || !donor.zip_code) {
    return 'Preencha todos os campos obrigatórios!';
  }

  if (!donor.email.includes('@') || donor.email.length < 5) {
    return 'E-mail inválido!';
  }

  if (!donor.phone.match(/^\(\d{2}\)\s*\d{4,5}-\d{4}$/)) {
    return 'Telefone inválido! Use o formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX.';
  }

  if (donor.type === 'PF' && (!donor.cpf || !donor.cpf.match(/^\d{11}$/))) {
    return 'CPF inválido! Deve conter 11 números.';
  }

  return null;
};

export function DonorFormModal({ initialDonor, mode, onClose, onSave }: DonorFormModalProps) {
  const [donorData, setDonorData] = useState<Donor>(initialDonor);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDonorData(initialDonor);
  }, [initialDonor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDonorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const validationError = validateDonor(donorData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSave(donorData, mode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-[95%] max-w-lg shadow-2xl relative transform transition-all scale-100 overflow-y-auto max-h-[90vh]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition" aria-label="Fechar modal">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {mode === 'edit' ? "Editar Doador" : "Cadastrar Novo Doador"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          {/* Tipo (somente criação) */}
          {mode === 'new' && (
            <div className="relative">
              <select
                name="type"
                value={donorData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white appearance-none pr-10"
                aria-label="Tipo de Doador"
              >
                <option value="" disabled>Selecione o Tipo</option>
                <option value="PF">Pessoa Física (PF)</option>
                <option value="PJ">Pessoa Jurídica (PJ)</option>
              </select>
              {donorData.type === 'PF' ? <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" /> : <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />}
            </div>
          )}

          {/* Nome / Razão Social */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Nome / Razão Social"
              value={donorData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
            />
            {donorData.type === 'PF' ? <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" /> : <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />}
          </div>

          {/* CPF (PF) */}
          {donorData.type === 'PF' && (
            <div className="relative">
              <input
                type="text"
                name="cpf"
                placeholder="CPF (somente números)"
                value={donorData.cpf || ''}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          )}

          {/* E-mail */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={donorData.email}
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
              value={donorData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Endereço */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="street_address"
              placeholder="Rua"
              value={donorData.street_address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              name="street_number"
              placeholder="Número"
              value={donorData.street_number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="street_complement"
              placeholder="Complemento"
              value={donorData.street_complement || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              name="street_neighborhood"
              placeholder="Bairro"
              value={donorData.street_neighborhood}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              name="city"
              placeholder="Cidade"
              value={donorData.city}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              name="state"
              placeholder="Estado"
              value={donorData.state}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <input
              type="text"
              name="zip_code"
              placeholder="CEP"
              value={donorData.zip_code}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Observação */}
          <div className="relative">
            <input
              type="text"
              name="observation"
              placeholder="Observações"
              value={donorData.observation || ''}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Status (edição) */}
          {mode === 'edit' && (
            <div className="relative">
              <select
                name="status"
                value={donorData.status}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white appearance-none pr-10"
                aria-label="Status do Doador"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">&#9660;</span>
            </div>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          {mode === 'edit' ? "Salvar Alterações" : "Cadastrar Doador"}
        </button>
      </div>
    </div>
  );
}
