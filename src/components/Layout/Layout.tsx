import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  activeMenuItem?: string;
}

export function Layout({ children, activeMenuItem }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar activeItem={activeMenuItem} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
