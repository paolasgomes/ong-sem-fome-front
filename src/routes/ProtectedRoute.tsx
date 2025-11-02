import { Navigate, Outlet } from "react-router-dom";
import { loadSession } from "../services/api";

export function ProtectedRoute() {
    const { token } = loadSession();

    // Se não estiver autenticado, redireciona para a tela de login
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // Se estiver autenticado, renderiza o conteúdo protegido
    return <Outlet />;
}
