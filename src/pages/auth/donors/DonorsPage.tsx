import {
  Search,
  User,
  Building2,
  Users,
  Mail,
  Phone,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { DonorFormModal, validateDonor } from "./FormularioDoador"; 
import { DeleteConfirmationModal } from "./ConfirmDeletar"; 

interface Donor {
  id: number;
  name: string;
  type: "PF" | "PJ";
  email: string;
  phone: string;
  totalDonations: number;
  lastDonation: string;
  status: "Ativo" | "Inativo";
}

const mockDonors: Donor[] = [
  { id: 1, name: "João Silva", type: "PF", email: "joao@email.com", phone: "(11) 99999-9999", totalDonations: 15, lastDonation: "14/01/2024", status: "Ativo" },
  { id: 2, name: "Supermercado ABC Ltda", type: "PJ", email: "contato@supermercadoabc.com", phone: "(11) 3333-3333", totalDonations: 45, lastDonation: "09/01/2024", status: "Ativo" },
  { id: 3, name: "Maria Santos", type: "PF", email: "maria@email.com", phone: "(11) 88888-8888", totalDonations: 8, lastDonation: "19/12/2023", status: "Inativo" },
  { id: 4, name: "Padaria do Bairro", type: "PJ", email: "padaria@email.com", phone: "(11) 7777-7777", totalDonations: 23, lastDonation: "07/01/2024", status: "Ativo" },
];

const INITIAL_NEW_DONOR: Donor = {
  id: 0,
  name: '',
  type: 'PF',
  email: '',
  phone: '',
  totalDonations: 0,
  lastDonation: '',
  status: 'Ativo',
};

export function DonorsPage() {
  const [donors, setDonors] = useState<Donor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('Todos os tipos');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [showFormModal, setShowFormModal] = useState(false); // Modal unificado (Edição/Criação)
  const [confirmDelete, setConfirmDelete] = useState<Donor | null>(null);
  const [newDonor, setNewDonor] = useState<Donor>(INITIAL_NEW_DONOR);

  useEffect(() => {
    setDonors(mockDonors);
  }, []);


  const totalPF = donors.filter((d) => d.type === "PF").length;
  const totalPJ = donors.filter((d) => d.type === "PJ").length;

  const filteredDonors = donors.filter((donor) => {
    const matchesSearch = donor.name.toLowerCase().includes(searchTerm.toLowerCase()) || donor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'Todos os tipos' || donor.type === (filterType as 'PF' | 'PJ');
    return matchesSearch && matchesType;
  });

  const handleOpenEdit = (donor: Donor) => {
    setSelectedDonor(donor);
    setShowFormModal(true);
  };

  const handleOpenNew = () => {
    setNewDonor(INITIAL_NEW_DONOR); 
    setSelectedDonor(null); 
    setShowFormModal(true);
  };

  const handleSave = (donorToSave: Donor, mode: 'edit' | 'new') => {
    const validationError = validateDonor(donorToSave);
    if (validationError) {
      alert(validationError); 
      return;
    }

    if (mode === 'edit') {
      setDonors((prev) => prev.map((d) => (d.id === donorToSave.id ? donorToSave : d)));
      setSelectedDonor(null);
    } else {
      const newId = donors.length > 0 ? Math.max(...donors.map(d => d.id)) + 1 : 1;
      setDonors([...donors, { ...donorToSave, id: newId }]);
      setNewDonor(INITIAL_NEW_DONOR);
    }
    setShowFormModal(false);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      setDonors((prev) => prev.filter((d) => d.id !== confirmDelete.id));
      setConfirmDelete(null);
    }
  };

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doadores</h1>
          <p className="text-gray-500 text-sm mt-2">Gestão de pessoas físicas e jurídicas</p>
        </div>
      <button
  onClick={handleOpenNew}
  className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all flex items-center gap-2"
  aria-label="Adicionar novo doador"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-5 h-5"
  >
    <path
      fillRule="evenodd"
      d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
      clipRule="evenodd"
    />
  </svg>
  Novo Doador
</button>

      </div>

      {/* Cards de Resumo Adicionados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card Total */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total de Doadores</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{donors.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full"><Users className="text-orange-500 w-7 h-7" /></div>
        </div>
        {/* Card PF */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Pessoa Física (PF)</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalPF}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-full"><User className="text-blue-500 w-7 h-7" /></div>
        </div>
        {/* Card PJ */}
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Pessoa Jurídica (PJ)</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalPJ}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-full"><Building2 className="text-green-500 w-7 h-7" /></div>
        </div>
      </div>
      {/* Fim dos Cards de Resumo */}


      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-1/2">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
            aria-label="Buscar doadores"
          />
        </div>
        <select
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
          aria-label="Filtrar por tipo"
        >
          <option>Todos os tipos</option>
          <option>PF</option>
          <option>PJ</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
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
                    {donor.type === 'PF' ? <User className="text-gray-400 w-4 h-4" /> : <Building2 className="text-gray-400 w-4 h-4" />}
                    {donor.name}
                  </td>
                  <td className="px-6 py-5">{donor.type}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {donor.email}</div>
                      <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {donor.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 font-semibold text-orange-600">{donor.totalDonations}</td>
                  <td className="px-6 py-5 text-gray-500">{donor.lastDonation}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${donor.status === 'Ativo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {donor.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 flex gap-4">
                    <button
                      onClick={() => handleOpenEdit(donor)}
                      className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                      aria-label={`Editar doador ${donor.name}`}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(donor)}
                      className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline"
                      aria-label={`Excluir doador ${donor.name}`}
                    >
                      <Trash2 className="w-4 h-4" /> Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showFormModal && (
        <DonorFormModal
          initialDonor={selectedDonor || newDonor}
          mode={selectedDonor ? 'edit' : 'new'}
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