import { useState, useEffect } from "react";
import { UserPlus, Search, Pencil, Trash2, Users, User, Building2 } from "lucide-react";
import { CollaboratorFormModal, validateCollaborator } from "./FormularioColab";
import { DeleteConfirmationModal } from "./DeleteColab";
import type { Collaborator } from "../../../types/Colaboradores";
import { getCollaborators, createCollaborator, updateCollaborator, deleteCollaborator } from "../../../services/apiColaboradores";

const INITIAL_NEW_COLLAB: Collaborator = {
  name: "",
  registration: Date.now().toString(),
  email: "",
  phone: "",
  type: "Voluntário",
  function: "",
  date_joined: "",
  observation: "",
  status: "Ativo",
};

export function ColaboradoresPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Todos os tipos");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const fetchCollaborators = async () => {
    try {
      const response = await getCollaborators(1, 1000);
      const data = response.results ?? [];

      setCollaborators(
        data.map((c: any) => ({
          id: c.id,
          name: c.name,
          registration: c.registration ?? String(c.id ?? Date.now()),
          email: c.email,
          phone: c.phone,
          type: c.is_volunteer ? "Voluntário" : "Funcionário",
          function: c.function ?? "",
          observation: c.observation ?? "",
          status: c.is_active ? "Ativo" : "Inativo",
          date_joined: c.admission_date ? c.admission_date.split("T")[0] : "",
        }))
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar colaboradores.");
    }
  };

  // Filtros
  const filteredCollaborators = collaborators.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      filterType === "Todos os tipos" ||
      (filterType === "Voluntário" && c.type === "Voluntário") ||
      (filterType === "Funcionário" && c.type === "Funcionário");
    return matchesSearch && matchesType;
  });

  // Paginação no front
  const totalPages = Math.ceil(filteredCollaborators.length / itemsPerPage);
  const paginatedCollaborators = filteredCollaborators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalVoluntarios = filteredCollaborators.filter(c => c.type === "Voluntário").length;
  const totalFuncionarios = filteredCollaborators.filter(c => c.type === "Funcionário").length;

  // Modais
  const openNewCollaborator = () => {
    setSelectedCollaborator({ ...INITIAL_NEW_COLLAB });
    setModalMode("new");
    setShowModal(true);
  };

  const openEditCollaborator = (collab: Collaborator) => {
    setSelectedCollaborator({
      ...collab,
      registration: collab.registration || collab.id?.toString() || Date.now().toString(),
      status: collab.status || "Ativo",
    });
    setModalMode("edit");
    setShowModal(true);
  };

  const handleSave = async (collab: Collaborator, mode: "new" | "edit") => {
    const validationError = validateCollaborator(collab);
    if (validationError) return alert(validationError);

    const collabToSend: any = {
  name: collab.name,
  registration: String(collab.registration),
  email: collab.email,
  phone: collab.phone.replace(/\D/g, ""),
  admission_date: collab.date_joined ? new Date(collab.date_joined).toISOString() : null,
  dismissal_date: null,
  is_volunteer: collab.type === "Voluntário",
  function: collab.function || null,
  observation: collab.observation || null,
  is_active: mode === "new" ? true : collab.status === "Ativo",
  sector_id: null,
  user_id: null,
};


    try {
      if (mode === "edit" && collab.id) {
        await updateCollaborator(collab.id, collabToSend);
      } else {
        await createCollaborator(collabToSend);
      }
      setShowModal(false);
      fetchCollaborators();
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.error || "Erro ao salvar colaborador.");
    }
  };

  const handleDelete = async () => {
    if (!selectedCollaborator?.id) return;
    try {
      await deleteCollaborator(selectedCollaborator.id);
      setSelectedCollaborator(null);
      setShowDeleteModal(false);
      fetchCollaborators();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir colaborador.");
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Colaboradores</h1>
          <p className="text-gray-500 text-sm mt-2">Cadastro e acompanhamento dos colaboradores da ONG.</p>
        </div>
        <button
          onClick={openNewCollaborator}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Novo Colaborador
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total de Colaboradores</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{filteredCollaborators.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full">
            <Users className="text-orange-500 w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Voluntários</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalVoluntarios}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-full">
            <User className="text-blue-500 w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Funcionários</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalFuncionarios}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-full">
            <Building2 className="text-green-500 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => { setFilterType(e.target.value); setCurrentPage(1); }}
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        >
          <option>Todos os tipos</option>
          <option>Voluntário</option>
          <option>Funcionário</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[700px]">
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
            {paginatedCollaborators.map(collab => (
              <tr key={collab.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">{collab.name}</td>
                <td className="py-3 px-6">{collab.type}</td>
                <td className="py-3 px-6">{collab.function}</td>
                <td className="py-3 px-6 flex flex-col">
                  <span>{collab.email}</span>
                  <span className="text-gray-500">{collab.phone}</span>
                </td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    collab.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>{collab.status}</span>
                </td>
                <td className="py-3 px-6 text-center flex items-center justify-center gap-3">
                  <button onClick={() => openEditCollaborator(collab)} className="p-2 text-blue-500 hover:text-blue-700 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setSelectedCollaborator(collab); setShowDeleteModal(true); }} className="p-2 text-red-500 hover:text-red-700 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedCollaborators.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">Nenhum colaborador encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
<div className="flex justify-center mt-6 gap-2 items-center">
  <button
    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  >
    &laquo; Anterior
  </button>

  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .map((page, idx, arr) => {
      const prev = arr[idx - 1];
      const showDots = prev && page - prev > 1;
      if (
        page === 1 ||
        page === totalPages ||
        (page >= currentPage - 1 && page <= currentPage + 1)
      ) {
        return (
          <span key={page} className="flex items-center">
            {showDots && <span className="px-2">...</span>}
            <button
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                page === currentPage
                  ? "bg-orange-500 text-white font-semibold"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {page}
            </button>
          </span>
        );
      }
      return null;
    })}

  <button
    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages || totalPages === 0}
    className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
  >
    Próximo &raquo;
  </button>
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
          donorName={selectedCollaborator.name}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
