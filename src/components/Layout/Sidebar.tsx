import { useNavigate } from "react-router-dom";
import { clearSession, loadSession } from "../../services/api";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Heart,
  Tag,
  CreditCard,
  Users2,
  UserPlus,
  Building2,
  FileText,
  DollarSign,
  Settings,
  ChevronsLeftRight,
  LogOut,
} from "lucide-react";

type SidebarProps = {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
};

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const location = useLocation();
  const { user } = loadSession();

  const role = user?.role ?? "logistica"; // <- ROLE DO BACK-END

  const userName = user?.name || "";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();

// Primeiro nome
  const formattedName =
  userName.split(" ")[0].charAt(0).toUpperCase() +
  userName.split(" ")[0].slice(1);


  // Menu completo
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "donors", label: "Doadores", icon: Users },
    { id: "doacoes", label: "Doações", icon: Heart },
    { id: "estoque", label: "Estoque", icon: Tag },
    { id: "saidas", label: "Saídas / Cestas", icon: CreditCard },
    { id: "colaboradores", label: "Colaboradores", icon: Users2 },
    { id: "familias", label: "Famílias", icon: UserPlus },
    { id: "campanhas", label: "Campanhas", icon: Building2 },
    { id: "solicitacoes", label: "Solicitações", icon: FileText },
    { id: "financeiro", label: "Financeiro", icon: DollarSign },
    { id: "relatorios", label: "Relatórios", icon: FileText },
    { id: "configuracoes", label: "Configurações", icon: Settings },
  ];

  // Permissões por role (AJUSTE COMO QUISER)
  const permissions = {
    admin: [
      "dashboard", "donors", "doacoes", "estoque", "saidas",
      "colaboradores", "familias", "campanhas", "solicitacoes",
      "financeiro", "relatorios", "configuracoes"
    ],
    logistica: [
      "dashboard", "donors", "doacoes", "estoque", "saidas",
      "familias", "solicitacoes"
    ],
    financeiro: [
      "dashboard", "financeiro", "relatorios"
    ]
  };

const allowedMenus = permissions[role];

  const isItemActive = (id: string) =>
    location.pathname === `/dashboard/${id}` ||
    location.pathname.startsWith(`/dashboard/${id}/`) ||
    (id === "dashboard" && location.pathname === "/dashboard");

  const navigate = useNavigate();
  function handleLogout() {
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen border-r border-gray-200 transition-all duration-300
      flex flex-col bg-white z-40 shadow-sm overflow-x-hidden
      ${isCollapsed ? "w-20" : "w-64"}`}
    >
      {/* Header */}
      <div className={`p-3 border-b border-gray-200 flex items-center relative ${isCollapsed ? "justify-center" : ""}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-800 text-sm whitespace-nowrap">
              ONG Sem Fome
            </span>
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`p-2 text-gray-600 hover:text-gray-900 transition rounded ${isCollapsed ? "" : "ml-auto"}`}
          aria-label="Colapsar sidebar"
        >
          <ChevronsLeftRight className="w-5 h-5 hover:cursor-pointer" />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <ul className="flex flex-col gap-2">
          {menuItems
            .filter(item => allowedMenus.includes(item.id)) // ⬅ FILTRO POR ROLE
            .map((item) => {
              const Icon = item.icon;
              const active = isItemActive(item.id);

              return (
                <li key={item.id} className="group relative">
                  <Link
                    to={`/dashboard/${item.id === "dashboard" ? "" : item.id}`}
                    className={`flex items-center gap-3 p-2 rounded-lg transition-all 
                      ${isCollapsed ? "justify-center" : ""}
                      ${active ? "bg-orange-500 text-white" : "text-gray-500 hover:bg-orange-500 hover:text-white"}
                    `}
                  >
                    <Icon className="w-5 h-5 shrink-0" />

                    {!isCollapsed && (
                      <span className="text-sm font-medium truncate">
                        {item.label}
                      </span>
                    )}
                  </Link>

                  {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 
                      bg-gray-800 text-white text-xs rounded-md px-2 py-1 whitespace-nowrap
                      opacity-0 group-hover:opacity-100 shadow-lg pointer-events-none transition-opacity">
                      {item.label}
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200">
        <div
          className={`flex items-center gap-3 transition-all ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-lx font-medium text-gray-600">{userInitial}</span>
          </div>

          {!isCollapsed && (
            <div>
              <p className="text-sm font-medium text-gray-900">{formattedName}</p>
              <p className="text-xs text-gray-500">{userEmail}</p>
            </div>
          )}

          {!isCollapsed && (
            <button onClick={handleLogout} className="ml-auto">
              <LogOut className="w-5 h-5 text-gray-500 hover:text-orange-500 cursor-pointer" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
