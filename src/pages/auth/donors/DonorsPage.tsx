// DonorsPage.tsx
import { useState, useEffect } from "react";
import { User, Users, Building2, Mail, Phone, Trash2, Search } from "lucide-react";
import { DonorFormModal, validateDonor } from "./FormularioDoador";
import { DeleteConfirmationModal } from "./ConfirmDeletar";
import { getDonors, createDonor, updateDonor, deleteDonor } from "../../../services/apiDonors";
import type { Donor, Pagination } from "../../../types/Donors";

const INITIAL_NEW_DONOR: Donor = {
  type: "PF",
  name: "",
  email: "",
  phone: "",
  cpf: "",
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
  const [donorsData, setDonorsData] = useState<Pagination<Donor>>({
    limit: 10,
    page: 1,
    totalPages: 1,
    results: [],
  });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("Todos os tipos");
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<Donor | null>(null);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      setLoading(true);
      const data = await getDonors(); // já retorna Pagination<Donor>
      setDonorsData(data);
    } catch (error) {
      console.error(error);
      alert("Falha ao carregar doadores.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (donor: Donor, mode: "new" | "edit") => {
    const validationError = validateDonor(donor);
    if (validationError) return alert(validationError);

    try {
      if (mode === "edit" && donor.id) {
        await updateDonor(donor.id, donor);
        setDonorsData((prev) => ({
          ...prev,
          results: prev.results.map((d) => (d.id === donor.id ? donor : d)),
        }));
      } else {
        const newDonor = await createDonor(donor);
        setDonorsData((prev) => ({
          ...prev,
          results: [...prev.results, newDonor],
        }));
      }
      setShowFormModal(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar o doador.");
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete?.id) return;
    try {
      await deleteDonor(confirmDelete.id);
      setDonorsData((prev) => ({
        ...prev,
        results: prev.results.filter((d) => d.id !== confirmDelete.id),
      }));
      setConfirmDelete(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir o doador.");
    }
  };

  const handleOpenEdit = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowFormModal(true);
  };

  const handleOpenNew = () => {
    setSelectedDonor(null);
    setShowFormModal(true);
  };

  // ----- Filtros e contagem -----
  const totalPF = donorsData.results.filter((d) => d.type === "PF").length;
  const totalPJ = donorsData.results.filter((d) => d.type === "PJ").length;

  const filteredDonors = donorsData.results.filter((donor) => {
    const matchesSearch =
      donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "Todos os tipos" || donor.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doadores</h1>
          <p className="text-gray-500 text-sm mt-2">Gestão de pessoas físicas e jurídicas</p>
        </div>
        <button
          onClick={handleOpenNew}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all flex items-center gap-2"
        >
          Novo Doador
        </button>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total de Doadores</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{donorsData.results.length}</p>
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

      {/* Busca e filtro */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
          />
        </div>
        <select
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
        >
          <option>Todos os tipos</option>
          <option>PF</option>
          <option>PJ</option>
        </select>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Carregando...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
              <tr>
                <th className="text-left px-6 py-4 font-medium">Nome / Razão Social</th>
                <th className="text-left px-6 py-4 font-medium">Tipo</th>
                <th className="text-left px-6 py-4 font-medium">Contato</th>
                <th className="text-left px-6 py-4 font-medium">Total Doações</th>
                <th className="text-left px-6 py-4 font-medium">Última Doação</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 text-base">
                    Nenhum doador encontrado.
                  </td>
                </tr>
              ) : (
                filteredDonors.map((donor) => (
                  <tr key={donor.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 flex items-center gap-3">
                      {donor.type === "PF" ? <User className="text-gray-400 w-4 h-4" /> : <Building2 className="text-gray-400 w-4 h-4" />}
                      {donor.name}
                    </td>
                    <td className="px-6 py-5">{donor.type}</td>
                    <td className="px-6 py-5 flex flex-col space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" /> {donor.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> {donor.phone}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-semibold text-orange-600">{donor.totalDonations}</td>
                    <td className="px-6 py-5 text-gray-500">{donor.lastDonation}</td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          donor.status === "Ativo" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                      >
                        {donor.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 flex gap-4">
                      <button
                        onClick={() => handleOpenEdit(donor)}
                        className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => setConfirmDelete(donor)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline"
                      >
                        <Trash2 className="w-4 h-4" /> Excluir
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modais */}
      {showFormModal && (
        <DonorFormModal
          initialDonor={selectedDonor || INITIAL_NEW_DONOR}
          mode={selectedDonor ? "edit" : "new"}
          onClose={() => setShowFormModal(false)}
          onSave={handleSave}
        />
      )}

      {confirmDelete && (
        <DeleteConfirmationModal
          donorName={confirmDelete.name}
          onClose={() => setConfirmDelete(null)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
}
