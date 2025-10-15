import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  activeMenuItem?: string;
}

export function Layout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar /> 

      <main className="flex-1 p-8"> 
        <Outlet /> 
      </main>
    </div>
  );
}
