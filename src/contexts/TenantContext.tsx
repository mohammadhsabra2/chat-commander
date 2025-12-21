import React, { createContext, useContext, useState, ReactNode } from "react";
import { tenants, Tenant } from "@/data/mockData";

interface TenantContextType {
  selectedTenant: string;
  setSelectedTenant: (tenantId: string) => void;
  tenantList: Tenant[];
  currentTenant: Tenant | null;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [selectedTenant, setSelectedTenant] = useState<string>("all");

  const currentTenant = selectedTenant === "all" 
    ? null 
    : tenants.find(t => t.id === selectedTenant) || null;

  return (
    <TenantContext.Provider value={{ 
      selectedTenant, 
      setSelectedTenant, 
      tenantList: tenants,
      currentTenant 
    }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
