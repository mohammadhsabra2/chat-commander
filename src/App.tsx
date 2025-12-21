import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import TenantsPage from "@/pages/TenantsPage";
import AssistantsPage from "@/pages/AssistantsPage";
import UsersPage from "@/pages/UsersPage";
import ConversationsPage from "@/pages/ConversationsPage";
import RolesPage from "@/pages/RolesPage";
import AccountPage from "@/pages/AccountPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tenants" element={<TenantsPage />} />
            <Route path="/assistants" element={<AssistantsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/conversations" element={<ConversationsPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
