import {
  LayoutDashboard,
  Users,
  Package,
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
  activeItem?: string;
}

export function Sidebar({ activeItem = "doadores" }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "doadores", label: "Doadores", icon: Users },
    { id: "doacoes", label: "Doações", icon: Package },
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
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center gap-2">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
          <Package className="w-5 h-5 text-white" />
        </div>
        <span className="font-semibold text-gray-800">ONG Sem Fome</span>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeItem;

            return (
              <li key={item.id}>
                <button
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
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
