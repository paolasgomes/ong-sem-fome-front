import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

export function LoginPage() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    navigate("/dashboard");
};

return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        {/* Logo */}
        <div className="flex items-center justify-center w-12 h-12 bg-orange-500 rounded-lg mx-auto mb-6">
        <Heart className="w-6 h-6 text-white" />
        </div>

        {/* Título */}
        <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Acesse sua conta</h2>
        <p className="text-gray-500 mt-2">Bem-vindo(a) de volta!</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit}>
        <div className="mb-4">
            <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
            >
            Email
            </label>
            <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seuemail@exemplo.com"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
        </div>

        <div className="mb-6">
            <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
            >
            Senha
            </label>
            <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
            />
        </div>

        <button
            type="submit"
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-md hover:bg-orange-600 transition-colors duration-200"
        >
            Entrar
        </button>
        </form>
    </div>
    </div>
);
}
