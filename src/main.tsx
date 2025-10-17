import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/global.css";

// Componentes e Páginas
import { Layout } from "./components/Layout/Layout"; 
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DonorsPage } from "./pages/auth/donors/DonorsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota de login (fora do layout principal) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas protegidas dentro do Layout */}
        <Route path="/donors" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="/donors" element={<DonorsPage />} />
          {/* Se quiser redirecionar "/" para "/dashboard" */}
          {/* <Route index element={<Navigate to="dashboard" replace />} /> */}
          {/* <Route index element={<Navigate to="DonorsPage" replace />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
