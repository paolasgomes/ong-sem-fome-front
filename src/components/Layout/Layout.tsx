import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    // trava o body e deixa só o main rolar
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      {/* Sidebar fixa (já é fixed no próprio componente) */}
      <Sidebar />

      {/* Conteúdo: desloca pela largura da sidebar (w-64 = 256px) */}
      <main className="ml-64 h-full overflow-y-auto">
        <div className="p-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
