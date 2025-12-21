import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";
import { TenantProvider } from "@/contexts/TenantContext";

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <TenantProvider>
      <div className="min-h-screen bg-background">
        <AppSidebar 
          collapsed={sidebarCollapsed} 
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        />
        <motion.div
          initial={false}
          animate={{ marginLeft: sidebarCollapsed ? 72 : 240 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex min-h-screen flex-col"
        >
          <AppHeader />
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </motion.div>
      </div>
    </TenantProvider>
  );
}
