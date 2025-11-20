import { useState, useEffect } from "react";
import { Search, PlusCircle, Eye, Gift, Package, CalendarDays, Coins } from "lucide-react";
import { getDonations, createDonation } from "../../../services/apidoacoes";
import type { Donation, Pagination } from "../../../types/Doacoes";
import { DonationFormModal } from "./DoacaoFormModal";
import { DoacaoDetalhesModal } from "./DoacaoDetalhesModal";

export function DoacoesPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchDonations();
  }, [currentPage]);

  const fetchDonations = async () => {
    try {
      const data: Pagination<Donation> = await getDonations(currentPage, itemsPerPage);
      setDonations(data.results);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar doações.");
    }
  };

  const handleSave = async (donation: any) => {
    try {
      await createDonation(donation);
      setShowModal(false);
      fetchDonations();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Erro ao salvar a doação.");
    }
  };

  // ======= FILTRO =======
  const filteredDonations = donations.filter(
    (donation) =>
      donation.donor?.name?.toLowerCase().includes(search.toLowerCase()) ||
      donation.product?.name?.toLowerCase().includes(search.toLowerCase()) ||
      donation.observations?.toLowerCase().includes(search.toLowerCase())
  );

  // ======== CARDS RESUMO (FILTRADOS) =========
  const totalValor = filteredDonations.reduce((sum, d) => sum + (d.amount || 0), 0);
  const totalQuantidade = filteredDonations.reduce((sum, d) => sum + (d.quantity || 0), 0);
  const mesAtual = new Date().getMonth();
  const totalEsteMes = filteredDonations.filter(
    (d) => new Date(d.created_at).getMonth() === mesAtual
  ).length;

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700">

      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doações</h1>
          <p className="text-gray-500 text-sm mt-2">
            Gestão de doações registradas
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Nova Doação
        </button>
      </div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        
        {/* Total Doações */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Total de Doações</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{filteredDonations.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-full">
            <Gift className="text-orange-500 w-7 h-7" />
          </div>
        </div>

        {/* Valor Total */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Valor Total</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">
              R$ {totalValor.toFixed(2)}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-full">
            <Coins className="text-green-500 w-7 h-7" />
          </div>
        </div>

        {/* Quantidade Total */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Quantidade Total (itens)</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalQuantidade}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-full">
            <Package className="text-blue-500 w-7 h-7" />
          </div>
        </div>

        {/* Este mês */}
        <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between border border-gray-100">
          <div>
            <p className="text-xs text-gray-500">Doações deste mês</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalEsteMes}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-full">
            <CalendarDays className="text-purple-500 w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Filtro */}
      <div className="relative w-full sm:w-1/2 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

        <input
          type="text"
          placeholder="Buscar por doador, produto ou observações..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
        />
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm min-w-[900px]">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-6">Data</th>
              <th className="py-3 px-6">Doador</th>
              <th className="py-3 px-6">Categoria</th>
              <th className="py-3 px-6">Produto</th>
              <th className="py-3 px-6">Quantidade</th>
              <th className="py-3 px-6">Valor</th>
              <th className="py-3 px-6 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {filteredDonations.map((donation) => (
              <tr key={donation.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6">
                  {new Date(donation.created_at).toLocaleDateString()}
                </td>

                <td className="py-3 px-6">{donation.donor?.name}</td>

                <td className="py-3 px-6">
                  { donation.type === "food"
                    ? "Alimentos"
                    : donation.type === "clothing"
                    ? "Roupas"
                    : donation.type === "money"
                    ? "Dinheiro"
                    : donation.type === "campaign"
                    ? "Campanha"
                    : "" }
                </td>

                <td className="py-3 px-6">{donation.product?.name ?? "-"}</td>

                <td className="py-3 px-6">
                  {donation.quantity} {donation.unit}
                </td>

                <td className="py-3 px-6">
                  R$ {donation.amount?.toFixed(2) ?? "0.00"}
                </td>

                {/* Ações */}
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => {
                      setSelectedDonation(donation);
                      setShowDetailsModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 transition flex items-center justify-center mx-auto gap-1"
                  >
                    <Eye className="w-4 h-4" />
                    Ver detalhes
                  </button>
                </td>
              </tr>
            ))}

            {filteredDonations.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Nenhuma doação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-6 gap-2 items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          &laquo; Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(
            (page) =>
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 1 && page <= currentPage + 1)
          )
          .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            const showDots = prev && page - prev > 1;

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
          })}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Próximo &raquo;
        </button>
      </div>

      {/* Modal Criar */}
      {showModal && (
        <DonationFormModal
          onClose={() => setShowModal(false)}
          onSave={handleSave}
        />
      )}

      {/* Modal Detalhes */}
      {showDetailsModal && selectedDonation && (
        <DoacaoDetalhesModal
          donation={selectedDonation}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}
