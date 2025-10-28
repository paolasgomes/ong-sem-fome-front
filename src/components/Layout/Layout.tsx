import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import {useState} from "react"

export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <main className={`h-full overflow-y-auto transition-all duration-300 ${isCollapsed ? "ml-20" : "ml-64"}`}>
        <div className="p-2">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
