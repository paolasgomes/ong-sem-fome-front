import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/global.css";

// Componentes e Páginas
//Importe o componente da página aqui 
import { Layout } from "./components/Layout/Layout"; 
import LoginPage from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { DonorsPage } from "./pages/auth/donors/DonorsPage";
import { FamiliasPage } from "./pages/auth/familias/FamiliasPage"
import { ColaboradoresPage } from "./pages/auth/colaboradores/ColaboradoresPage"
import { ErrorPage } from "./pages/ErrorPage"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Rota de login (fora do layout principal) */}
        <Route path="/" element={<LoginPage />} />

        {/* Rotas protegidas dentro do Layout */}
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="donors" element={<DonorsPage />} />
          <Route path="familias" element={<FamiliasPage />} />
          <Route path="colaboradores" element={<ColaboradoresPage />} />


          {/* 
            Quando for adicionar uma nova rota que utiliza a Sidebar, insira aqui dentro. 
            O "path" deve corresponder ao id definido em menuItems na Sidebar.
            Lembrar de importar o componente da página antes de adicionar a rota.

            é nois :)
          */} 

          <Route path="doacoes" element={<ErrorPage />} />
          <Route path="estoque" element={<ErrorPage />} />
          <Route path="saidas" element={<ErrorPage />} />
          <Route path="campanhas" element={<ErrorPage />} />
          <Route path="solicitacoes" element={<ErrorPage />} />
          <Route path="financeiro" element={<ErrorPage />} />
          <Route path="relatorios" element={<ErrorPage />} />
          <Route path="configuracoes" element={<ErrorPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
