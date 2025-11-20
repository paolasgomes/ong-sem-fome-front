import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/global.css";

// Componentes e Páginas
import { Layout } from "./components/Layout/Layout"; 
import LoginPage from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DonorsPage } from "./pages/auth/donors/DonorsPage";
import { FamiliasPage } from "./pages/auth/familias/FamiliasPage";
import { ColaboradoresPage } from "./pages/auth/colaboradores/ColaboradoresPage";
import { ErrorPage } from "./pages/ErrorPage";
import { RoleProtectedRoute } from "./routes/ProtectedRoute"; 
import { EstoquePage } from "./pages/auth/estoque/EstoquePage";
import { ProtectedRoute } from "./routes/ProtectedRoute"; 
import { SettingsPage } from "./pages/auth/configuracoes/ConfigPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Página de login (pública) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas que exigem usuário autenticado */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>

            <Route index element={<DashboardPage />} />

            {/* ADMIN */}
            <Route element={<RoleProtectedRoute allowed={["admin"]} />}>
              <Route path="colaboradores" element={<ColaboradoresPage />} />
            </Route>

            {/* LOGÍSTICA + ADMIN */}
            <Route element={<RoleProtectedRoute allowed={["admin", "logistica"]} />}>
              <Route path="estoque" element={<EstoquePage />} />
            </Route>

            {/* FINANCEIRO + ADMIN */}
            <Route element={<RoleProtectedRoute allowed={["admin", "financeiro"]} />}>
              <Route path="financeiro" element={<ErrorPage />} />
            </Route>

            {/* Rotas acessíveis a todos os usuários autenticados */}
            <Route path="donors" element={<DonorsPage />} />
            <Route path="familias" element={<FamiliasPage />} />
            <Route path="configuracoes" element={<SettingsPage />} />

            {/* Outras rotas internas (ainda sem implementação) */}
            <Route path="doacoes" element={<ErrorPage />} />
            <Route path="saidas" element={<ErrorPage />} />
            <Route path="campanhas" element={<ErrorPage />} />
            <Route path="solicitacoes" element={<ErrorPage />} />
            <Route path="relatorios" element={<ErrorPage />} />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
