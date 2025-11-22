import { useState, useEffect, useMemo, useRef } from "react";
import { Search, PlusCircle, Eye, Gift, Package, CalendarDays, Coins } from "lucide-react";

import { getDonations, createDonation } from "../../../services/apiDoacoes";
import type { Donation, Pagination } from "../../../types/Doacoes";

import { DonationFormModal } from "./DoacaoFormModal";
import { DoacaoDetalhesModal } from "./DoacaoDetalhesModal";

export function DoacoesPage() {
  // estados principais
  const [donations, setDonations] = useState<Donation[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const itemsPerPage = 5;

  const [allDonations, setAllDonations] = useState<Donation[] | null>(null);
  const [totalsLoading, setTotalsLoading] = useState<boolean>(false);

  // busca
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const searchTimeoutRef = useRef<number | null>(null);

  // ui
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);

  // debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);

    // @ts-ignore
    searchTimeoutRef.current = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setCurrentPage(1);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) window.clearTimeout(searchTimeoutRef.current);
    };
  }, [search]);

  // buscar página
  const fetchDonationsPage = async (page = 1, limit = itemsPerPage, searchParam = "") => {
    setLoading(true);
    setError(null);

    try {
      const data: Pagination<Donation> = await getDonations(page, limit, searchParam);
      setDonations(data.results);
      setTotalPages(data.totalPages ?? Math.max(1, Math.ceil((data.total ?? data.results.length) / limit)));
    } catch (err) {
      setError("Erro ao carregar doações.");
      setDonations([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // buscar todos para totais
  const fetchAllDonationsForTotals = async () => {
    setTotalsLoading(true);

    try {
      const pageSize = 200;
      const first: Pagination<Donation> = await getDonations(1, pageSize);
      const results = first.results ?? [];
      const totalPagesFromApi = first.totalPages ?? Math.ceil((first.total ?? results.length) / pageSize);

      for (let p = 2; p <= totalPagesFromApi; p++) {
        try {
          const pageData: Pagination<Donation> = await getDonations(p, pageSize);
          results.push(...(pageData.results ?? []));
        } catch {}
      }

      setAllDonations(results);
    } catch {
      setAllDonations([]);
    } finally {
      setTotalsLoading(false);
    }
  };

  // buscas automáticas
  useEffect(() => {
    fetchDonationsPage(currentPage, itemsPerPage, debouncedSearch);
  }, [currentPage, debouncedSearch]);

  useEffect(() => {
    fetchAllDonationsForTotals();
  }, []);

  // HANDLE: salvar doação
  const handleSave = async (donation: any) => {
    try {
      await createDonation(donation);
      setShowModal(false);
      fetchDonationsPage(currentPage, itemsPerPage, debouncedSearch);
      fetchAllDonationsForTotals();
    } catch (err: any) {
      alert(err?.response?.data?.error || "Erro ao salvar.");
    }
  };

  // totais gerais
  const totalsMemo = useMemo(() => {
    const list = allDonations ?? [];

    const totalValor = list.reduce((sum, d) => sum + (d.amount ?? 0), 0);
    const totalQuantidade = list.reduce((sum, d) => sum + (d.quantity ?? 0), 0);

    const now = new Date().getMonth();
    const totalEsteMes = list.filter((d) => new Date(d.created_at).getMonth() === now).length;

    return { totalValor, totalQuantidade, totalEsteMes, totalDoacoes: list.length };
  }, [allDonations]);

  // filtro
  const filteredDonations = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return donations;

    return donations.filter((donation) =>
      (donation.donor?.name ?? "").toLowerCase().includes(q) ||
      (donation.product?.name ?? "").toLowerCase().includes(q) ||
      (donation.observations ?? "").toLowerCase().includes(q)
    );
  }, [donations, debouncedSearch]);

  // formatadores
  const formatNumber = (value: number): string => {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(1) + "M";
    if (value >= 1_000) return (value / 1_000).toFixed(1) + "k";
    return value.toString();
  };

  const formatCurrency = (value: number): string =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (dateStr?: string) =>
    dateStr ? new Date(dateStr).toLocaleDateString("pt-BR") : "-";

  return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700">
      {/* header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Doações</h1>
          <p className="text-gray-500 text-sm mt-2">Gestão de doações registradas</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" /> Nova Doação
        </button>
      </div>

      {/* cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">

  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500">Total de Doações</p>
      <p className="text-3xl font-bold mt-1">{formatNumber(totalsMemo.totalDoacoes)}</p>
    </div>
    <div className="bg-orange-50 p-4 rounded-full">
      <Gift className="text-orange-500 w-7 h-7" />
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500">Valor Total</p>
      <p className="text-3xl font-bold mt-1">{formatCurrency(totalsMemo.totalValor)}</p>
    </div>
    <div className="bg-green-50 p-4 rounded-full">
      <Coins className="text-green-500 w-7 h-7" />
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500">Quantidade Total</p>
      <p className="text-3xl font-bold mt-1">{formatNumber(totalsMemo.totalQuantidade)}</p>
    </div>
    <div className="bg-blue-50 p-4 rounded-full">
      <Package className="text-blue-500 w-7 h-7" />
    </div>
  </div>

  <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
    <div>
      <p className="text-xs text-gray-500">Doações deste mês</p>
      <p className="text-3xl font-bold mt-1">{formatNumber(totalsMemo.totalEsteMes)}</p>
    </div>
    <div className="bg-purple-50 p-4 rounded-full">
      <CalendarDays className="text-purple-500 w-7 h-7" />
    </div>
  </div>

</div>


      {/* filtro */}
      <div className="relative w-full sm:w-1/2 mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar por doador, produto ou observações..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {loading && <div className="text-center mb-4">Carregando...</div>}
      {error && <div className="text-center mb-4 text-red-500">{error}</div>}

      {/* tabela */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left text-sm min-w-[900px]">
          <thead className="bg-gray-100 uppercase text-xs font-semibold">
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
              <tr key={donation.id} className="hover:bg-gray-50">
                <td className="py-3 px-6">{formatDate(donation.created_at)}</td>
                <td className="py-3 px-6">{donation.donor?.name ?? "-"}</td>

                <td className="py-3 px-6">
                  {donation.product?.category?.name ??
                    (donation.type === "food"
                      ? "Alimentos"
                      : donation.type === "clothing"
                      ? "Roupas"
                      : donation.type === "money"
                      ? "Dinheiro"
                      : donation.type === "campaign"
                      ? "Campanha"
                      : "-")}
                </td>

                <td className="py-3 px-6">{donation.product?.name ?? "-"}</td>

                <td className="py-3 px-6">
                  {donation.quantity
                    ? `${formatNumber(donation.quantity)} ${donation.unit ?? ""}`
                    : "-"}
                </td>

                <td className="py-3 px-6">
                  {donation.amount ? formatCurrency(donation.amount) : "R$ 0,00"}
                </td>

                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => {
                      setSelectedDonation(donation);
                      setShowDetailsModal(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 flex justify-center gap-1"
                  >
                    <Eye className="w-4 h-4" /> Ver detalhes
                  </button>
                </td>
              </tr>
            ))}

            {filteredDonations.length === 0 && !loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  Nenhuma doação encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* paginação */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
        >
          « Anterior
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1))
          .map((page, idx, arr) => {
            const prev = arr[idx - 1];
            const showDots = prev && page - prev > 1;

            return (
              <span key={page} className="flex items-center">
                {showDots && <span className="px-2">...</span>}

                <button
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition ${
                    page === currentPage ? "bg-orange-500 text-white" : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {page}
                </button>
              </span>
            );
          })}

        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300"
        >
          Próximo »
        </button>
      </div>

      {showModal && (
        <DonationFormModal onClose={() => setShowModal(false)} onSave={handleSave} />
      )}

      {showDetailsModal && selectedDonation && (
        <DoacaoDetalhesModal donation={selectedDonation} onClose={() => setShowDetailsModal(false)} />
      )}
    </div>
  );
}
