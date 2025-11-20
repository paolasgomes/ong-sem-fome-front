import { useState, useEffect  } from "react";
import { X, User, Mail, KeyRound  } from "lucide-react";
import type { IUser } from "../../../../services/apiUser";
import type { UserRole } from "../../../../services/apiUser";

interface Props {
    onSave: (u: IUser) => void;
    onClose: () => void;
    user?: IUser | null;
}

type UserFormState = {
    name: string;
    email: string;
    role: "" | UserRole;
    password: string;
};

export function UserFormModal({ onSave, onClose, user }: Props) {
const [form, setForm] = useState<UserFormState>({
    name: user?.name ?? "",
    email: user?.email ?? "",
    role: user?.role ?? "",
    password: "",
});

useEffect(() => {
    if (user) {
        setForm({
            name: user.name,
            email: user.email,
            role: user.role,
            password: "",
        });
    } else {
        setForm({
            name: "",
            email: "",
            role: "",
            password: "",
        });
    }
}, [user]);

const handleChange = (e: any) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
};

const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
    alert("Preencha todos os campos!");
    return;
    }
    onSave({
    ...form,
    role: form.role as UserRole
});
};

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-xl relative">

        {/* Botão fechar */}
        <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
        <X className="w-5 h-5" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
            {user ? "Editar Usuário" : "Novo Usuário"}
        </h2>

        <div className="space-y-4">

        {/* Nome */}
        <div className="relative">
            <input
            type="text"
            name="name"
            placeholder="Nome completo"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm 
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                        focus:outline-none transition"
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* E-mail */}
        <div className="relative">
            <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm 
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                        focus:outline-none transition"
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>

        {/* Perfil */}
        <div className="relative">
            <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg pr-4 py-3 text-sm 
                            focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                            focus:outline-none transition bg-white"
                >
                <option value="" disabled>Selecione o perfil de acesso</option>
                <option value="admin">Administrativo</option>
                <option value="financeiro">Financeiro</option>
                <option value="logistica">Logística</option>
            </select>
        </div>

        {/* Senha */}
        <div className="relative">
            <input
            type="text"
            name="password"
            placeholder="Senha"
            value={form.password}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-sm 
                        focus:ring-2 focus:ring-orange-500 focus:border-orange-500 
                        focus:outline-none transition"
            />
            <KeyRound  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
        </div>

        <button
            onClick={handleSubmit}
            className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg"
            >
            {user ? "Salvar Alterações" : "Criar Usuário"}
        </button>
    </div>
    </div>
);
}
