import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import "./styles/global.css";

// Componentes e Páginas
import { Layout } from "./components/Layout/Layout"; 
import { LoginPage } from "./pages/Loginpage";
import { DashboardPage } from "./pages/Dashboardpage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota para a página de login (fora do layout principal) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rota principal que usa o Layout com a Sidebar */}
        <Route path="/dashboard" element={<Layout />}>
          {/* A primeira página a ser exibida dentro do Layout */}
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
