import { Navigate, Outlet } from "react-router-dom";
import { loadSession } from "../services/api";

// Proteção comum → exige estar logado
export function ProtectedRoute() {
    const { token } = loadSession();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

// Proteção por cargo → exige estar logado E ter role permitida
export function RoleProtectedRoute({ allowed }: { allowed: string[] }) {
    const { token, user } = loadSession();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (!user || !allowed.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}