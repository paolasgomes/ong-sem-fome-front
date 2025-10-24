import { useState } from "react";
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
} from "lucide-react";

interface SidebarProps {
  activeItem?: string | null;
}

export function Sidebar({ activeItem = null }: SidebarProps) {
  const [selectedItem, setSelectedItem] = useState(activeItem);
  const location = useLocation();

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

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 
                flex flex-col justify-between shadow-sm z-40"
    >
      {/* Header */}
      <div className="p-2 border-b border-gray-200 flex items-center gap-3">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <Heart className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-gray-800 text-sm">ONG Sem Fome</span>
      </div>

      {/* Menu */}
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="flex flex-col gap-0.7">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname ===
                `/dashboard${item.id === "dashboard" ? "" : `/${item.id}`}` ||
              location.pathname ===
                `/dashboard/${item.id === "dashboard" ? "" : `${item.id}/`}`;

            return (
              <li key={item.id}>
                <Link
                  to={`/dashboard/${item.id === "dashboard" ? "" : item.id}`}
                  onClick={() => setSelectedItem(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white font-medium"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-950"
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">AU</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">admin@example.com</p>
          </div>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </aside>
  );
}