// DonorsPage.tsx
import { useState, useEffect } from "react";
import { User, Users, Building2, Trash2, Search, Pencil, UserPlus } from "lucide-react";
import { DonorFormModal, validateDonor } from "./FormularioDoador";
import { DeleteConfirmationModal } from "./ConfirmDeletar";
import { getDonors, createDonor, updateDonor, deleteDonor } from "../../../services/apiDonors";
import type { Donor, Pagination } from "../../../types/Donors";

const INITIAL_NEW_DONOR: Donor = {
  type: "pessoa_fisica",
  name: "",
  email: "",
  phone: "",
  cpf: "",
  cnpj: "",
  street_address: "",
  street_number: "",
  street_complement: "",
  street_neighborhood: "",
  city: "",
  state: "",
  zip_code: "",
  observation: "",
  totalDonations: 0,
  lastDonation: "",
  status: "Ativo",
};

export function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Todos os tipos");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"new" | "edit">("new");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Buscar doadores do backend
  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const data: Pagination<Donor> = await getDonors({ page: 1, limit: 1000 }); // pega todos para filtrar no front
      setDonors(data.results);
    } catch (error) {
      console.error(error);
      alert("Falha ao carregar doadores.");
    }
  };

  const handleSave = async (donor: Donor, mode: "new" | "edit") => {
    const validationError = validateDonor(donor);
    if (validationError) return alert(validationError);

    const donorToSend: any = { ...donor };
    if (donor.type === "pessoa_fisica") {
      delete donorToSend.cnpj;
      donorToSend.cpf = donor.cpf?.replace(/\D/g, "");
    } else {
      delete donorToSend.cpf;
      donorToSend.cnpj = donor.cnpj?.replace(/\D/g, "");
    }
    donorToSend.totalDonations = donorToSend.totalDonations || 0;
    donorToSend.lastDonation = donorToSend.lastDonation || "";

    try {
      if (mode === "edit" && donor.id) {
        await updateDonor(donor.id, donorToSend);
      } else {
        await createDonor(donorToSend);
      }
      setShowModal(false);
      fetchDonors();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao salvar o doador.");
    }
  };

  const handleDelete = async () => {
    if (!selectedDonor?.id) return;
    try {
      await deleteDonor(selectedDonor.id);
      setSelectedDonor(null);
      setShowDeleteModal(false);
      fetchDonors();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o doador.");
    }
  };

  const openNewDonor = () => {
    setSelectedDonor(INITIAL_NEW_DONOR);
    setModalMode("new");
    setShowModal(true);
  };

  const openEditDonor = (donor: Donor) => {
    setSelectedDonor(donor);
    setModalMode("edit");
    setShowModal(true);
  };

  // ====== FILTROS ======
  const filteredDonors = donors.filter(donor => {
    const typeMatch =
      filterType === "Todos os tipos" ||
      (filterType === "PF" && donor.type === "pessoa_fisica") ||
      (filterType === "PJ" && donor.type === "pessoa_juridica");

    const searchMatch =
      donor.name.toLowerCase().includes(search.toLowerCase()) ||
      donor.email.toLowerCase().includes(search.toLowerCase());

    return typeMatch && searchMatch;
  });

  // Paginação no front-end
  const totalPages = Math.ceil(filteredDonors.length / itemsPerPage);
  const paginatedDonors = filteredDonors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPF = filteredDonors.filter(d => d.type === "pessoa_fisica").length;
  const totalPJ = filteredDonors.filter(d => d.type === "pessoa_juridica").length;

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doadores</h1>
          <p className="text-gray-500 text-sm mt-2">Gestão de pessoas físicas e jurídicas</p>
        </div>
        <button
          onClick={openNewDonor}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Novo Doador
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total de Doadores</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{filteredDonors.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full">
            <Users className="text-orange-500 w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Pessoa Física (PF)</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalPF}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-full">
            <User className="text-blue-500 w-7 h-7" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Pessoa Jurídica (PJ)</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalPJ}</p>
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
          <option>PF</option>
          <option>PJ</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[800px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-6">Nome / Razão Social</th>
              <th className="py-3 px-6">Tipo</th>
              <th className="py-3 px-6">Contato</th>
              <th className="py-3 px-6">Total Doações</th>
              <th className="py-3 px-6">Última Doação</th>
              <th className="py-3 px-6">Status</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDonors.map((donor) => (
              <tr key={donor.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 flex items-center gap-2">
                  {donor.type === "pessoa_fisica" ? <User className="w-4 h-4 text-gray-400" /> : <Building2 className="w-4 h-4 text-gray-400" />}
                  {donor.name}
                </td>
                <td className="py-3 px-6">{donor.type === "pessoa_fisica" ? "PF" : "PJ"}</td>
                <td className="py-3 px-6 flex flex-col">
                  <span>{donor.email}</span>
                  <span className="text-gray-500">{donor.phone}</span>
                </td>
                <td className="py-3 px-6 font-semibold text-orange-600">{donor.totalDonations}</td>
                <td className="py-3 px-6 text-gray-500">{donor.lastDonation}</td>
                <td className="py-3 px-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${donor.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {donor.status}
                  </span>
                </td>
                <td className="py-3 px-6 text-center flex items-center justify-center gap-3">
                  <button onClick={() => openEditDonor(donor)} className="p-2 text-blue-500 hover:text-blue-700 transition">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => { setSelectedDonor(donor); setShowDeleteModal(true); }} className="p-2 text-red-500 hover:text-red-700 transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
            {paginatedDonors.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">Nenhum doador encontrado.</td>
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

        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-4 py-2 rounded-lg transition-colors ${page === currentPage ? "bg-orange-500 text-white font-semibold" : "bg-gray-100 hover:bg-gray-200"}`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Próximo &raquo;
        </button>
      </div>

      {/* Modais */}
      {showModal && selectedDonor && (
        <DonorFormModal
          initialDonor={selectedDonor}
          mode={modalMode}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {showDeleteModal && selectedDonor && (
        <DeleteConfirmationModal
          donorName={selectedDonor.name}
          onConfirm={handleDelete}
          onClose={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  );
}
