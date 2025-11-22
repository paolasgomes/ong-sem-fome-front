import { useEffect, useState } from "react";
import { X, Package, Ruler } from "lucide-react";
import type { Product } from "../../../../services/apiProducts";
import { getCategories, type ICategory } from "../../../../services/apiCategory";

interface Props {
onSave: (p: Partial<Product>) => void;
onClose: () => void;
product?: Product | null;
}

export function ProductFormModal({ onSave, onClose, product }: Props) {
const [form, setForm] = useState<Product>({
    name: "",
    unit: "",
    minimum_stock: 0,
    is_active: true,
    category_id: null,
});

const [categories, setCategories] = useState<ICategory[]>([]);
const [loadingCategories, setLoadingCategories] = useState(false);

// Carregar categorias
const fetchCategories = async () => {
    try {
    setLoadingCategories(true);
    const data = await getCategories();
    setCategories(data.results || []);
    } catch (err) {
    console.error(err);
    alert("Erro ao carregar categorias");
    } finally {
    setLoadingCategories(false);
    }
};

useEffect(() => {
    fetchCategories();
}, []);

useEffect(() => {
    if (product) {
        setForm({
        id: product.id,
        name: product.name,
        unit: product.unit,
        minimum_stock: product.minimum_stock,
        is_active: product.is_active,
        category_id: product.category_id ?? product.category?.id ?? null,
        });
    }
}, [product]);


const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({
    ...prev,
    [name]:
        name.includes("stock") || name === "category_id"
        ? Number(value)
        : value,
    }));
};

const handleSubmit = () => {
    if (!form.name || !form.unit) {
        alert("Preencha o nome e a unidade!");
        return;
    }

    const payload: Partial<Product> = {
        name: form.name,
        unit: form.unit,
        minimum_stock: form.minimum_stock,
        is_active: form.is_active,
        category_id: form.category_id,
    };
    if (form.id) payload.id = form.id;
    onSave(payload);
};

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
        <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        {product ? "Editar Produto" : "Novo Produto"}
        </h2>

        <div className="space-y-4">
        {/* NOME */}
        <div className="flex flex-col gap-1">
            <label htmlFor="name" className="text-gray-600 text-sm font-medium">
            Nome do produto
            </label>

            <div className="relative">
            <input
                id="name"
                type="text"
                name="name"
                placeholder="Digite o nome do produto"
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 pr-4 py-3"
            />
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
        </div>

        {/* UNIDADE */}
        <div className="flex flex-col gap-1">
            <label
                htmlFor="unit"
                className="text-gray-600 text-sm font-medium"
            >
                Unidade de medida
            </label>

            <div className="relative">
                <select
                id="unit"
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className="w-full border rounded-lg pl-10 pr-4 py-3 bg-white"
                >
                <option value="">Selecione...</option>
                <option value="un">un — Unidade</option>
                <option value="kg">kg — Quilograma</option>
                <option value="g">g — Grama</option>
                <option value="l">l — Litro</option>
                <option value="ml">ml — Mililitro</option>
                <option value="cx">cx — Caixa</option>
                </select>

                <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
        </div>

        {/* ESTOQUE MÍNIMO */}
        <div className="flex flex-col gap-1">
        <label htmlFor="minimum_stock" className="text-gray-600 text-sm font-medium">
            Estoque mínimo
        </label>

        <input
            id="minimum_stock"
            type="number"
            name="minimum_stock"
            placeholder="Digite o estoque mínimo"
            value={form.minimum_stock}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
        />
        </div>

        {/* SELECT DE CATEGORIA */}
        <div className="flex flex-col gap-1">
            <label htmlFor="category_id" className="text-gray-600 text-sm font-medium">
            Categoria
            </label>

            <select
            id="category_id"
            name="category_id"
            value={form.category_id ?? ""}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-3"
            >
            <option value="">Selecione uma categoria</option>

            {loadingCategories ? (
                <option disabled>Carregando...</option>
            ) : (
                categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                    {cat.name}
                </option>
                ))
            )}
            </select>
        </div>

        </div>

        <button
        onClick={handleSubmit}
        className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
        >
        {product ? "Salvar Alterações" : "Criar Produto"}
        </button>
    </div>
</div>
);
}
