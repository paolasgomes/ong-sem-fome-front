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



          {/* 
            Quando for adicionar uma nova rota que utiliza a Sidebar, insira aqui dentro. 
            O "path" deve corresponder ao id definido em menuItems na Sidebar.
            Lembrar de importar o componente da página antes de adicionar a rota.

            é nois :)
          */} 




          
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
