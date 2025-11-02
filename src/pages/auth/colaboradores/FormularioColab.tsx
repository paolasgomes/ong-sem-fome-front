// // FormularioColab.tsx
import { useState, useEffect } from "react";
import { X, User, Mail, Phone, Briefcase } from "lucide-react";
import type { Collaborator } from "../../../types/Colaboradores";

interface CollaboratorFormModalProps {
  initialCollaborator: Collaborator;
  mode: "edit" | "new";
  onClose: () => void;
  onSave: (collaborator: Collaborator, mode: "edit" | "new") => void;
}

export const validateCollaborator = (collab: Collaborator): string | null => {
  if (
    !collab.name ||
    !collab.email ||
    !collab.phone ||
    !collab.function ||
    !collab.type ||
    !collab.date_joined
  ) {
    return "Preencha todos os campos obrigatórios!";
  }

  if (!collab.email.includes("@") || collab.email.length < 5) {
    return "E-mail inválido!";
  }

  const rawPhone = collab.phone.replace(/\D/g, "");
  if (rawPhone.length < 10 || rawPhone.length > 11) {
    return "Telefone inválido! Deve conter DDD e número com 10 ou 11 dígitos.";
  }

  return null;
};

export function CollaboratorFormModal({
  initialCollaborator,
  mode,
  onClose,
  onSave,
}: CollaboratorFormModalProps) {
  const [collabData, setCollabData] = useState<Collaborator>({ ...initialCollaborator });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCollabData(initialCollaborator);
  }, [initialCollaborator]);

  // mascara telefone (mesma do donors)
  const formatPhone = (value: string) => {
    const v = value.replace(/\D/g, "").slice(0, 11);
    if (v.length <= 10)
      return v.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
    return v.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3").replace(/-$/, "");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCollabData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const validationError = validateCollaborator(collabData);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onSave(collabData, mode);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-8 w-[95%] max-w-lg shadow-2xl relative transform transition-all scale-100 overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition"
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
          {mode === "edit" ? "Editar Colaborador" : "Cadastrar Novo Colaborador"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="space-y-4">
          {/* Nome */}
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="Nome Completo"
              value={collabData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none transition"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Tipo */}
          <div className="relative">
            <select
              name="type"
              value={collabData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            >
              <option value="">Selecione o tipo...</option>
              <option value="Voluntário">Voluntário</option>
              <option value="Funcionário">Funcionário</option>
            </select>
          </div>

          {/* Função */}
          <div className="relative">
            <input
              type="text"
              name="function"
              placeholder="Função (Ex: Coordenador, Estoquista)"
              value={collabData.function}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* E-mail */}
          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={collabData.email}
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
              value={collabData.phone}
              onChange={(e) =>
                setCollabData((prev) => ({
                  ...prev,
                  phone: formatPhone(e.target.value),
                }))
              }
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          {/* Data de Ingresso */}
          <div className="relative">
            <input
              type="date"
              name="date_joined"
              value={collabData.date_joined}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Observação */}
          <div className="relative">
            <textarea
              name="observation"
              placeholder="Observações"
              value={collabData.observation || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              name="status"
              value={collabData.status}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-md hover:shadow-lg"
        >
          {mode === "edit" ? "Salvar Alterações" : "Cadastrar Colaborador"}
        </button>
      </div>
    </div>
  );
}
