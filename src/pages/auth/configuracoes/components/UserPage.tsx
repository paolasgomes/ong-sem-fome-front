    import { useEffect, useState } from "react";
    import { Pencil, Plus } from "lucide-react";
    import { createUser, getUsers, updateUser } from "../../../../services/apiUser";
    import { UserFormModal } from "../components/UserFormModal";
    import type { IUser } from "../../../../services/apiUser";

    export function UsersPage() {
    const [users, setUsers] = useState<IUser[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchUsers = async () => {
        try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data || []);
        } catch (err) {
        console.error(err);
        alert("Erro ao carregar usuários");
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSave = async (user: IUser) => {
        try {
        setLoading(true);

        if (selectedUser) {
            //Atualizar usuário existente
            const updated = await updateUser(selectedUser.id!, user);

            setUsers((prev) =>
            prev.map((u) => (u.id === selectedUser.id ? updated : u))
            );

        } else {
            //Criar usuário novo
            const newUser = await createUser(user);
            setUsers((prev) => [...prev, newUser]);
        }

        setShowForm(false);
        setSelectedUser(null);

        } catch (err) {
        console.error(err);
        alert("Erro ao salvar usuário");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="p-10 bg-gray-50 min-h-screen text-gray-700 text-sm">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">
            <div>
            <h1 className="text-2xl font-semibold text-gray-800">Usuários do Sistema</h1>
            <p className="text-gray-500 mt-1">Gerenciamento de acesso</p>
            </div>

            <button
            onClick={() => { setSelectedUser(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow transition cursor-pointer"
            >
            <Plus className="w-5 h-5" />
            Novo Usuário
            </button>
        </div>

        {/* TABELA */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
                <tr>
                <th className="py-3 px-6">Nome</th>
                <th className="py-3 px-6">E-mail</th>
                <th className="py-3 px-6">Perfil</th>
                <th className="py-3 px-6 text-center">Ações</th>
                </tr>
            </thead>

            <tbody>
                {loading && users.length === 0 && (
                <tr><td colSpan={4} className="py-6 text-center text-orange-500">Carregando...</td></tr>
                )}

                {users.length === 0 && !loading && (
                <tr><td colSpan={4} className="py-6 text-center text-gray-500">Nenhum usuário cadastrado.</td></tr>
                )}

                {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-6 font-medium">{u.name}</td>
                    <td className="py-3 px-6">{u.email}</td>
                    <td className="py-3 px-6 capitalize">{u.role}</td>

                    <td className="py-3 px-6 text-center">
                    <div className="flex justify-center gap-3">
                        
                        {/*EDITAR */}
                        <button
                        className="text-blue-500 hover:text-blue-700"
                        onClick={() => {
                            setSelectedUser(u);
                            setShowForm(true);
                        }}
                        >
                        <Pencil className="w-4 h-4" />
                        </button>

                    </div>
                    </td>

                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* MODAL */}
        {showForm && (
            <UserFormModal
            onClose={() => setShowForm(false)}
            onSave={handleSave}
            user={selectedUser}   
            />
        )}
        </div>
    );
    }
