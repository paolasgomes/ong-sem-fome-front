import { Navigate, Outlet } from "react-router-dom";
import { loadSession } from "../services/api";

export function ProtectedRoute() {
    const { token } = loadSession();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

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