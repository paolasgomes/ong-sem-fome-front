import { useState } from "react";
import {UsersPage} from "./components/UserPage";
import { ProductsPage } from "./components/ProductPage";
import { CategoryPage } from "./components/CategoryPage";

export function SettingsPage() {
    const [activeTab, setActiveTab] = useState("categorias");

    const tabs = [
        { id: "categorias", label: "Categorias" },
        { id: "produtos", label: "Produtos" },
        { id: "setores", label: "Setores" },
        { id: "usuarios", label: "Usuários" },
        { id: "sistema", label: "Sistema" },
    ];

    return (
        <div className="p-6 w-full">
            <h2 className="text-2xl font-semibold mb-1">Configurações</h2>
            <p className="text-sm text-gray-600 mb-4">
                Gestão de categorias, cadastro de produtos, setores, usuários e perfis
            </p>

            {/* Abas */}
            <div className="flex gap-6 pb-2 mb-1">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className={`pb-2 ${
                            activeTab === t.id
                                ? "text-orange-500 border-b-2 border-orange-500"
                                : "text-gray-500 cursor-pointer"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Conteúdo da aba selecionada */}
            <div>
                {activeTab === "usuarios" && <UsersPage />}
                {activeTab === "produtos" && <ProductsPage />}
                {activeTab === "categorias" && <CategoryPage />}

                {/* Ainda não implementadas */}
                {(activeTab === "setores" ||
                activeTab === "sistema") && (
                    <div className="text-gray-500 text-sm">
                        Esta seção será implementada futuramente.
                    </div>
                )}
            </div>
        </div>
    );
}
