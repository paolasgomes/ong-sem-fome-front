import { useEffect, useMemo, useState } from "react";
import {
Search,
Users,
Phone,
Trash2,
MapPin,
Home,
UserRound,
} from "lucide-react";
import { FamilyFormModal } from "./FamiliasForm";
import { DeleteFamilia } from "./DeleteFamilia";

interface Family {
id: number;
responsible: string;
members: number;
address: string;
phone: string;
income: number;
lastDelivery: string; // dd/mm/yyyy ou yyyy-mm-dd (formatamos abaixo)
status: "Ativa" | "Inativa";
}

const mockFamilies: Family[] = [
{
    id: 1,
    responsible: "Ana Silva",
    members: 4,
    address: "Rua das Flores, 123 - Centro",
    phone: "(11) 99999-9999",
    income: 800,
    lastDelivery: "2024-01-14",
    status: "Ativa",
},
{
    id: 2,
    responsible: "Carlos Santos",
    members: 3,
    address: "Av. Principal, 456 - Vila Nova",
    phone: "(11) 88888-8888",
    income: 600,
    lastDelivery: "2024-01-09",
    status: "Ativa",
},
];

const INITIAL_NEW_FAMILY: Family = {
id: 0,
responsible: "",
members: 0,
address: "",
phone: "",
income: 0,
lastDelivery: "",
status: "Ativa",
};

export function FamiliasPage() {
const [families, setFamilies] = useState<Family[]>([]);
const [searchTerm, setSearchTerm] = useState("");
const [statusFilter, setStatusFilter] = useState<"Todos" | "Ativa" | "Inativa">(
    "Todos"
);

const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
const [showFormModal, setShowFormModal] = useState(false);
const [confirmDelete, setConfirmDelete] = useState<Family | null>(null);
const [newFamily, setNewFamily] = useState<Family>(INITIAL_NEW_FAMILY);

useEffect(() => {
    setFamilies(mockFamilies);
}, []);

// ===== métricas =====
const totalFamilies = families.length;
const activeFamilies = families.filter((f) => f.status === "Ativa").length;
const totalPeople = families.reduce((acc, f) => acc + (f.members || 0), 0);
const attendedThisMonth = families.filter((f) => {
    if (!f.lastDelivery) return false;
    const d = new Date(f.lastDelivery);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}).length;

// ===== formatters =====
const formatCurrencyBRL = (value: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    value || 0
    );

const formatDateBR = (input: string) => {
    if (!input) return "-";
    // aceita "yyyy-mm-dd" ou "dd/mm/yyyy"
    const isoLike = /^\d{4}-\d{2}-\d{2}$/;
    const brLike = /^\d{2}\/\d{2}\/\d{4}$/;

    if (isoLike.test(input)) {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
    }
    if (brLike.test(input)) return input;
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString("pt-BR");
};

const splitAddress = (addr: string) => {
    if (!addr) return { line1: "-", line2: "" };
    const [left, maybeBairro] = addr.split(" - ");
    return { line1: left || addr, line2: maybeBairro || "" };
};

// ===== filtros =====
const filteredFamilies = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return families.filter((f) => {
    const matchesSearch =
        f.responsible.toLowerCase().includes(term) ||
        f.address.toLowerCase().includes(term) ||
        f.phone.toLowerCase().includes(term);
    const matchesStatus = statusFilter === "Todos" || f.status === statusFilter;
    return matchesSearch && matchesStatus;
    });
}, [families, searchTerm, statusFilter]);

// ===== ações =====
const handleOpenEdit = (family: Family) => {
    setSelectedFamily(family);
    setShowFormModal(true);
};

const handleOpenNew = () => {
    setNewFamily(INITIAL_NEW_FAMILY);
    setSelectedFamily(null);
    setShowFormModal(true);
};

const handleSave = (familyToSave: Family, mode: "edit" | "new") => {
    if (mode === "edit") {
    setFamilies((prev) => prev.map((f) => (f.id === familyToSave.id ? familyToSave : f)));
    setSelectedFamily(null);
    } else {
    const newId = families.length > 0 ? Math.max(...families.map((f) => f.id)) + 1 : 1;
    setFamilies([...families, { ...familyToSave, id: newId }]);
    setNewFamily(INITIAL_NEW_FAMILY);
    }
    setShowFormModal(false);
};

const handleDelete = () => {
    if (confirmDelete) {
    setFamilies((prev) => prev.filter((f) => f.id !== confirmDelete.id));
    setConfirmDelete(null);
    }
};

return (
    <div className="p-10 bg-gray-50 min-h-screen text-sm text-gray-700 relative">
    {/* Header + botão */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Famílias Beneficiadas</h1>
        <p className="text-gray-500 text-sm mt-2">
            Cadastro e acompanhamento das famílias atendidas
        </p>
        </div>

        {/* Botão seguindo mesmo padrão (SVG + classes) */}
        <button
        onClick={handleOpenNew}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-md transition-all flex items-center gap-2"
        aria-label="Cadastrar nova família"
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
        Nova Família
        </button>
    </div>

    {/* Cards de resumo — mesmas classes do exemplo */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Total de Famílias</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{totalFamilies}</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-full">
            <Home className="text-orange-500 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Famílias Ativas</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{activeFamilies}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-full">
            <UserRound className="text-green-600 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Pessoas Atendidas</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">
            {totalPeople.toLocaleString("pt-BR")}
            </p>
        </div>
        <div className="bg-purple-50 p-4 rounded-full">
            <Users className="text-purple-600 w-7 h-7" />
        </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all flex items-center justify-between border border-gray-100">
        <div>
            <p className="text-xs text-gray-500">Atendidas Este Mês</p>
            <p className="text-3xl font-bold mt-1 text-gray-800">{attendedThisMonth}</p>
        </div>
        <div className="bg-blue-50 p-4 rounded-full">
            <Home className="text-blue-500 w-7 h-7" />
        </div>
        </div>
    </div>

    {/* Filtros (busca + status) com mesmo layout do exemplo */}
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-1/2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
            type="text"
            placeholder="Buscar por responsável, endereço ou telefone..."
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-4 py-3 w-full border border-gray-200 rounded-md text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
            aria-label="Buscar famílias"
        />
        </div>

        <select
        onChange={(e) => setStatusFilter(e.target.value as "Todos" | "Ativa" | "Inativa")}
        className="border border-gray-200 rounded-md px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50"
        aria-label="Filtrar por status"
        >
        <option value="Todos">Todos os status</option>
        <option value="Ativa">Ativa</option>
        <option value="Inativa">Inativa</option>
        </select>
    </div>

    {/* Tabela — mesmas classes/ritmo do exemplo */}
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600 border-b">
            <tr>
            <th className="text-left px-6 py-4 font-medium">Responsável</th>
            <th className="text-left px-6 py-4 font-medium">Membros</th>
            <th className="text-left px-6 py-4 font-medium">Endereço</th>
            <th className="text-left px-6 py-4 font-medium">Telefone</th>
            <th className="text-left px-6 py-4 font-medium">Renda Familiar</th>
            <th className="text-left px-6 py-4 font-medium">Última Entrega</th>
            <th className="text-left px-6 py-4 font-medium">Status</th>
            <th className="text-left px-6 py-4 font-medium">Ações</th>
            </tr>
        </thead>
        <tbody>
            {filteredFamilies.length === 0 ? (
            <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500 text-base">
                Nenhuma família encontrada.
                </td>
            </tr>
            ) : (
            filteredFamilies.map((f) => {
                const { line1, line2 } = splitAddress(f.address);
                return (
                <tr key={f.id} className="border-b hover:bg-gray-50 transition-colors">
                    {/* Responsável */}
                    <td className="px-6 py-5 font-medium text-gray-800">{f.responsible}</td>

                    {/* Membros */}
                    <td className="px-6 py-5">
                    {f.members} {f.members === 1 ? "pessoa" : "pessoas"}
                    </td>

                    {/* Endereço (2 linhas + ícone) */}
                    <td className="px-6 py-5">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" /> {line1}
                        </div>
                        {line2 && (
                        <div className="text-gray-400 text-xs leading-tight">{line2}</div>
                        )}
                    </div>
                    </td>

                    {/* Telefone */}
                    <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" /> {f.phone}
                    </div>
                    </td>

                    {/* Renda */}
                    <td className="px-6 py-5 font-semibold text-orange-600">
                    {formatCurrencyBRL(f.income)}
                    </td>

                    {/* Última Entrega */}
                    <td className="px-6 py-5 text-gray-500">{formatDateBR(f.lastDelivery)}</td>

                    {/* Status */}
                    <td className="px-6 py-5">
                    <span
                        className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        f.status === "Ativa"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                    >
                        {f.status}
                    </span>
                    </td>

                    {/* Ações */}
                    <td className="px-6 py-5 flex flex-wrap gap-4">
                    <button
                        onClick={() => handleOpenEdit(f)}
                        className="text-orange-600 hover:text-orange-700 font-medium hover:underline"
                        aria-label={`Editar família ${f.responsible}`}
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => setConfirmDelete(f)}
                        className="text-red-600 hover:text-red-700 flex items-center gap-1 font-medium hover:underline"
                        aria-label={`Excluir família ${f.responsible}`}
                    >
                        <Trash2 className="w-4 h-4" /> Excluir
                    </button>
                    </td>
                </tr>
                );
            })
            )}
        </tbody>
        </table>
    </div>

    {/* Modal (novo/editar) */}
    {showFormModal && (
        <FamilyFormModal
        initialFamily={selectedFamily || newFamily}
        mode={selectedFamily ? "edit" : "new"}
        onClose={() => setShowFormModal(false)}
        onSave={handleSave}
        />
    )}

    {/* Confirmação de exclusão */}
    {confirmDelete && (
        <DeleteFamilia
        familyName={confirmDelete.responsible}
        onClose={() => setConfirmDelete(null)}
        onConfirm={handleDelete}
        />
    )}
    </div>
);
}
