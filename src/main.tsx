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
import { ProtectedRoute } from "./routes/ProtectedRoute"; // ✅ descomente e use!
import { DoacoesPage } from "./pages/auth/doacoes/DoacoesPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Página de login (pública) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas protegidas dentro do Layout */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<DashboardPage />} />
            <Route path="donors" element={<DonorsPage />} />
            <Route path="familias" element={<FamiliasPage />} />
            <Route path="colaboradores" element={<ColaboradoresPage />} />
            <Route path="doacoes" element={<DoacoesPage/>} />

            {/* Outras rotas internas */}
            <Route path="estoque" element={<ErrorPage />} />
            <Route path="saidas" element={<ErrorPage />} />
            <Route path="campanhas" element={<ErrorPage />} />
            <Route path="solicitacoes" element={<ErrorPage />} />
            <Route path="financeiro" element={<ErrorPage />} />
            <Route path="relatorios" element={<ErrorPage />} />
            <Route path="configuracoes" element={<ErrorPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
