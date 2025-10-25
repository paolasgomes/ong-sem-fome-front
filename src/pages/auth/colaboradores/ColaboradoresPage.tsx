import { useState, useEffect } from "react";
import { UserPlus, Search, Pencil, Trash2 } from "lucide-react";
import { CollaboratorFormModal } from "./FormularioColab";

import type { Collaborator } from "../../../types/Colaboradores";

export function ColaboradoresPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [filtered, setFiltered] = useState<Collaborator[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock inicial
  useEffect(() => {
    const mockData: Collaborator[] = [
      {
        id: 1,
        name: "Maria Souza",
        email: "maria@email.com",
        phone: "(11) 99999-9999",
        type: "Voluntário",
        function: "Coordenadora",
        date_joined: "2023-06-14",
        observation: "",
        status: "Ativo",
      },
      {
        id: 2,
        name: "João Lima",
        email: "joao@email.com",
        phone: "(11) 88888-8888",
        type: "Funcionário",
        function: "Estoquista",
        date_joined: "2022-03-09",
        observation: "",
        status: "Ativo",
      },
    ];
    setCollaborators(mockData);
    setFiltered(mockData);
  }, []);

  useEffect(() => {
    setFiltered(
      collaborators.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, collaborators]);

  const openNewCollaborator = () => {
    setSelectedCollaborator({
      name: "",
      email: "",
      phone: "",
      type: "Voluntário",
      function: "",
      date_joined: "",
      observation: "",
      status: "Ativo",
    });
    setModalMode("new");
    setShowModal(true);
  };

  const openEditCollaborator = (collab: Collaborator) => {
    setSelectedCollaborator(collab);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSave = (collab: Collaborator, mode: "edit" | "new") => {
    if (mode === "new") {
      setCollaborators((prev) => [...prev, { ...collab, id: Date.now() }]);
    } else {
      setCollaborators((prev) =>
        prev.map((c) => (c.id === collab.id ? collab : c))
      );
    }
    setShowModal(false);
  };

  const handleDelete = () => {
    if (selectedCollaborator) {
      setCollaborators((prev) =>
        prev.filter((c) => c.id !== selectedCollaborator.id)
      );
    }
    setShowDeleteModal(false);
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Colaboradores</h1>
          <p className="text-gray-500 text-sm mt-2">
            Cadastro e acompanhamento dos colaboradores da ONG.
          </p>
        </div>

        <button
          onClick={openNewCollaborator}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Novo Colaborador
        </button>
      </div>

      {/* Campo de busca */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar colaborador..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-6">Nome</th>
              <th className="py-3 px-6">Tipo</th>
              <th className="py-3 px-6">Função</th>
              <th className="py-3 px-6">Contato</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((collab) => (
              <tr key={collab.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">{collab.name}</td>
                <td className="py-3 px-6">{collab.type}</td>
                <td className="py-3 px-6">{collab.function}</td>
                <td className="py-3 px-6">
                  <div className="flex flex-col">
                    <span>{collab.email}</span>
                    <span className="text-gray-500">{collab.phone}</span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      collab.status === "Ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {collab.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => openEditCollaborator(collab)}
                      className="p-2 text-blue-500 hover:text-blue-700 transition"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCollaborator(collab);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-red-500 hover:text-red-700 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modais */}
      {showModal && selectedCollaborator && (
        <CollaboratorFormModal
          initialCollaborator={selectedCollaborator}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showDeleteModal && selectedCollaborator && (
        <DeleteConfirmationModal
          title="Excluir Colaborador"
          message={`Tem certeza que deseja excluir ${selectedCollaborator.name}?`}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
