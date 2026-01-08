import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import DashboardPage from "@/pages/DashboardPage";
import TenantsPage from "@/pages/TenantsPage";
import AssistantsPage from "@/pages/AssistantsPage";
import UsersPage from "@/pages/UsersPage";
import ConversationsPage from "@/pages/ConversationsPage";
import RolesPage from "@/pages/RolesPage";
import AccountPage from "@/pages/AccountPage";
import LoginPage from "@/pages/LoginPage";
import NotFound from "@/pages/NotFound";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
