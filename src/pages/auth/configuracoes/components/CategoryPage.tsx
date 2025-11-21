// CategoryPage.tsx
import { useEffect, useState } from "react";
import { Pencil, Plus } from "lucide-react";
import {
createCategory,
updateCategory,
getCategories,
type ICategory,
} from "../../../../services/apiCategory";
import { CategoryFormModal } from "../components/CategoryFormModal"; // componente separado

export function CategoryPage() {
const [categories, setCategories] = useState<ICategory[]>([]);
const [loading, setLoading] = useState(false);
const [modalOpen, setModalOpen] = useState(false);
const [editing, setEditing] = useState<ICategory | null>(null);

// Carrega categorias
const fetchCategories = async () => {
    try {
    setLoading(true);
    const data = await getCategories();
    setCategories(data.results || []);
    } catch (err) {
    console.error(err);
    alert("Erro ao carregar categorias");
    } finally {
    setLoading(false);
    }
};

useEffect(() => {
    fetchCategories();
}, []);

const openCreateModal = () => {
    setEditing(null);
    setModalOpen(true);
};

const openEditModal = (cat: ICategory) => {
    setEditing(cat);
    setModalOpen(true);
};

const handleSave = async (name: string, isPerishable: boolean) => {
    try {
    if (editing?.id !== undefined) {
        const updated = await updateCategory(editing.id, { name, is_perishable: isPerishable });
        setCategories((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
        );
    } else {
        const created = await createCategory({ name, is_perishable: isPerishable });
        setCategories((prev) => [...prev, created]);
    }
    setModalOpen(false);
    setEditing(null);
    } catch (err) {
    console.error(err);
    alert("Erro ao salvar categoria");
    }
};

return (
    <div className="p-10 bg-gray-50 min-h-screen text-gray-700 text-sm">
    <div className="flex justify-between items-center mb-10">
        <div>
        <h1 className="text-2xl font-semibold text-gray-800">Categorias</h1>
        <p className="text-gray-500 mt-1">Cadastro e gerenciamento de categorias</p>
        </div>

        <button
        onClick={openCreateModal}
        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer"
        >
        <Plus className="w-5 h-5" />
        Nova Categoria
        </button>
    </div>

    {/* Lista de categorias */}
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <table className="w-full text-left">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
            <th className="py-3 px-6">Nome</th>
            <th className="py-3 px-6">Perecível?</th>
            <th className="py-3 px-6 text-center">Ações</th>
            </tr>
        </thead>

        <tbody>
            {loading && categories.length === 0 && (
            <tr>
                <td colSpan={3} className="py-6 text-center text-orange-500">
                Carregando...
                </td>
            </tr>
            )}

            {!loading && categories.length === 0 && (
            <tr>
                <td colSpan={3} className="py-6 text-center text-gray-500">
                Nenhuma categoria cadastrada.
                </td>
            </tr>
            )}

            {categories.map((cat) => (
            <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="py-3 px-6 font-medium">{cat.name}</td>
                <td className="py-3 px-6">{cat.is_perishable ? "Sim" : "Não"}</td>
                <td className="py-3 px-6 text-center">
                <button
                    className="text-blue-500 hover:text-blue-700 cursor-pointer"
                    onClick={() => openEditModal(cat)}
                >
                    <Pencil className="w-4 h-4" />
                </button>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </div>

    {/* Modal de criação/edição */}
    {modalOpen && (
        <CategoryFormModal
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        category={editing}
        />
    )}
    </div>
);
}
