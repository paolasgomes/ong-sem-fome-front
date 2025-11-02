import { Navigate, Outlet } from "react-router-dom";
import { loadSession } from "../services/api";

export function ProtectedRoute() {
    const { token } = loadSession();

    if (!token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
