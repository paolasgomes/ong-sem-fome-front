import { useState, useEffect } from "react";
import { Home, Users, UserRound, Trash2, Search, UserPen ,FileUser   } from "lucide-react";
import { FamilyFormModal, validateFamily } from "./FamiliasForm";
import { getFamily, createFamily, updateFamily, deleteFamily } from "../../../services/apiFamily";
import {DeleteFamilyConfirmationModal} from "../familias/DeleteFamilia"
import type {Pagination, Family } from "../../../types/Family";
import { FamilyProfileCard } from "../familias/FamilyProfileCard";

const INITIAL_NEW_FAMILY: Family = {
    responsible_name: "",
    responsible_cpf: "",
    street_number: "",
    street_complement: "",
    street_neighborhood: "",
    city: "",
    state: "",
    zip_code: "",
    street_address: "",
    phone: "",
    email: "",
    members_count: 0,
    income_bracket: "",
    address: "",
    observation: "",
    is_active: true,
};

export function FamiliasPage() {
    const [familyData, setFamilyData] = useState<Pagination<Family>>({
        limit: 10,
        page: 1,
        totalPages: 1,
        results: [],
    });

    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState<"Todos" | "Ativa" | "Inativa">("Todos");
    const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
    const [showFormModal, setShowFormModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState<Family | null>(null);
    const [viewFamily, setViewFamily] = useState<Family | null>(null);

    // ======= Carregar famílias =======
    useEffect(() => {
        fetchFamily();
    }, []);

    const fetchFamily = async () => {
        try {
        setLoading(true);
        const data = await getFamily();
        setFamilyData(data);
        } catch (error) {
        console.error(error);
        alert("Falha ao carregar famílias.");
        } finally {
        setLoading(false);
        }
    };

    // ======= Salvar (novo ou editar) =======
    const handleSave = async (family: Family, mode: "new" | "edit") => {
        const validationError = validateFamily(family);
        if (validationError) return alert(validationError);

        try {
        if (mode === "edit" && family.id) {
            await updateFamily(family.id, family);
            setFamilyData((prev) => ({
            ...prev,
            results: prev.results.map((f) => (f.id === family.id ? family : f)),
            }));
        } else {
            const newFamily = await createFamily(family);
            setFamilyData((prev) => ({
            ...prev,
            results: [...prev.results, newFamily],
            }));
        }
        setShowFormModal(false);
        } catch (error) {
        console.error(error);
        alert("Erro ao salvar a família.");
        }finally {
            setLoading(false)
        }
    };

    // ======= Excluir =======
    const handleDelete = async () => {
        if (!confirmDelete?.id) return;
        try {
        setLoading(true)
        await deleteFamily(confirmDelete.id);
        setFamilyData((prev) => ({
            ...prev,
            results: prev.results.filter((f) => f.id !== confirmDelete.id),
        }));
        setConfirmDelete(null);
        } catch (error) {
        console.error(error);
        alert("Erro ao excluir a família.");
        }finally {
        setLoading(false)
    }};

    // ======= Abrir formulário =======
    const handleOpenEdit = (family: Family) => {
        setSelectedFamily(family);
        setShowFormModal(true);
    };

    const handleOpenNew = () => {
        setSelectedFamily(null);
        setShowFormModal(true);
    };

    // ======= Filtros e contagens =======
    const totalAtivo = familyData.results.filter((f) => f.is_active).length;
    const totalPeople = familyData.results.reduce((acc, f) => acc + (f.members_count || 0), 0);

    const filteredFamilies = familyData.results.filter((family) => {
        const matchesSearch =
        family.responsible_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        family.phone.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType =
        filterType === "Todos" ||
        (filterType === "Ativa" && family.is_active) ||
        (filterType === "Inativa" && !family.is_active);

        return matchesSearch && matchesType;
    });

    return (
        <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
        {/* Header + botão */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <div>
            <h1 className="text-2xl font-semibold text-gray-800">Famílias Beneficiadas</h1>
            <p className="text-gray-500 text-sm mt-2">Cadastro e acompanhamento das famílias atendidas</p>
            </div>
            <button
            onClick={handleOpenNew}
            className="bg-orange-500 hover:bg-orange-600 cursor-pointer text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all flex items-center gap-2"
            >
            <Home className="w-5 h-5" /> Nova Família
            </button>
        </div>

        {/* Cards de resumo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
            <div>
                <p className="text-xs text-gray-500">Total de Famílias</p>
                <p className="text-3xl font-bold mt-1 text-gray-800">{familyData.results.length}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-full">
                <Home className="text-orange-500 w-7 h-7" />
            </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
            <div>
                <p className="text-xs text-gray-500">Famílias Ativas</p>
                <p className="text-3xl font-bold mt-1 text-gray-800">{totalAtivo}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-full">
                <UserRound className="text-green-600 w-7 h-7" />
            </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
            <div>
                <p className="text-xs text-gray-500">Pessoas Atendidas</p>
                <p className="text-3xl font-bold mt-1 text-gray-800">{totalPeople.toLocaleString("pt-BR")}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-full">
                <Users className="text-purple-600 w-7 h-7" />
            </div>
            </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="relative w-full sm:w-1/2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
                type="text"
                placeholder="Buscar por responsável, telefone ou email..."
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                />
            </div>
            <select
                onChange={(e) => setFilterType(e.target.value as "Todos" | "Ativa" | "Inativa")}
                className="border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
                >
                <option value="Todos">Todos os status</option>
                <option value="Ativa">Ativa</option>
                <option value="Inativa">Inativa</option>
            </select>
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-gray-600 border-b">
                <tr>
                <th className="text-left px-6 py-4 font-medium">Responsável</th>
                <th className="text-left px-6 py-4 font-medium">Membros</th>
                <th className="text-left px-6 py-4 font-medium">Endereço</th>
                <th className="text-left px-6 py-4 font-medium">Telefone</th>
                <th className="text-left px-6 py-4 font-medium">Renda Familiar</th>
                <th className="text-left px-6 py-4 font-medium">Status</th>
                <th className="text-left px-6 py-4 font-medium">Ações</th>
                </tr>
            </thead>
            <tbody>

                {/* NOVO TRECHO PARA LOADING NA TABELA */}
                {loading && filteredFamilies.length === 0 && (
                    <tr>
                        <td colSpan={7} className="text-center py-12 text-orange-500 font-medium">
                            Carregando famílias...
                        </td>
                    </tr>
                )}

                {filteredFamilies.length === 0 ? (
                <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500 text-base">
                    Nenhuma família encontrada.
                    </td>
                </tr>
                ) : (
                filteredFamilies.map((f) => (
                    <tr key={f.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-5 font-medium text-gray-800">{f.responsible_name}</td>
                    <td className="px-6 py-5">{f.members_count}</td>
                    <td className="px-6 py-5">{f.address}</td>
                    <td className="px-6 py-5">{f.phone}</td>
                    <td className="px-6 py-5">{f.income_bracket}</td>
                    <td className="px-6 py-5">
                        <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                            f.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                        >
                        {f.is_active ? "Ativa" : "Inativa"}
                        </span>
                    </td>
                    <td className="px-6 py-5">
                        <div className="flex flex-col gap-2">
                        <button
                        onClick={() => handleOpenEdit(f)}
                        className="text-orange-600 hover:text-orange-700 flex items-center gap-1 font-medium hover:cursor-pointer"
                        >
                        <UserPen className="w-4 h-4" /> Editar
                        </button>

                        <button
                        onClick={() => setConfirmDelete(f)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:cursor-pointer"
                        >
                        <Trash2 className="w-4 h-4" /> Excluir
                        </button>

                        <button
                        onClick={() => setViewFamily(f)}
                        className="text-blue-600 hover:text-blue-700 flex items-center gap-1 font-medium hover:cursor-pointer"
                        >
                        <FileUser className="w-4 h-4" /> Ver perfil
                        </button>
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>

        {showFormModal && (
            <FamilyFormModal
            initialFamily={selectedFamily || INITIAL_NEW_FAMILY}
            mode={selectedFamily ? "edit" : "new"}
            onClose={() => setShowFormModal(false)}
            onSave={handleSave}
            />
        )}

        {confirmDelete && (
            <DeleteFamilyConfirmationModal
                familyName={confirmDelete.responsible_name}
                onClose={() => setConfirmDelete(null)}
                onConfirm={handleDelete}
                loading={loading}
                />
            )}

        {viewFamily && (
        <FamilyProfileCard
            family={viewFamily}
            onClose={() => setViewFamily(null)}
        />
        )}

        </div>
    );
}

