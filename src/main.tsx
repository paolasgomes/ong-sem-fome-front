import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import { Layout } from "./components/Layout/Layout";
import { DonorsPage } from "./pages/Donors/DonorsPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Layout activeMenuItem="doadores">
      <DonorsPage />
    </Layout>
  </StrictMode>
);
