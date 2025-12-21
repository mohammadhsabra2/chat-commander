import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Bot,
  Eye,
  Copy,
  Archive,
  Star,
} from "lucide-react";
import { useTenant } from "@/contexts/TenantContext";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/ui/empty-state";
import { assistants, tenants, AIAssistant } from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.03 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export default function AssistantsPage() {
  const { selectedTenant } = useTenant();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "draft">("all");
  const [tenantFilter, setTenantFilter] = useState<string>("all");

  const filteredAssistants = assistants.filter((assistant) => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || assistant.status === statusFilter;
    const matchesTenant = tenantFilter === "all" || assistant.tenantId === tenantFilter;
    const matchesGlobalTenant = selectedTenant === "all" || assistant.tenantId === selectedTenant;
    return matchesSearch && matchesStatus && matchesTenant && matchesGlobalTenant;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">AI Assistants</h1>
          <p className="page-description">Create and manage chatbots across all tenants</p>
        </div>
        <Button asChild>
          <Link to="/assistants/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New AI Assistant
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search assistants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {selectedTenant === "all" && (
              <Select value={tenantFilter} onValueChange={setTenantFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Tenants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  {tenants.map((tenant) => (
                    <SelectItem key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
              <SelectTrigger className="w-[150px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assistants Table */}
      <Card>
        <CardContent className="p-0">
          {filteredAssistants.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={<Bot className="h-6 w-6" />}
                title="No assistants found"
                description="Create your first AI assistant to get started."
                action={{
                  label: "Create AI Assistant",
                  onClick: () => {},
                }}
              />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assistant Name</th>
                    <th>Tenant</th>
                    <th>Status</th>
                    <th>Conversations (30d)</th>
                    <th>Avg Satisfaction</th>
                    <th>Knowledge</th>
                    <th>Last Modified</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssistants.map((assistant) => (
                    <motion.tr key={assistant.id} variants={rowVariants}>
                      <td>
                        <Link
                          to={`/assistants/${assistant.id}`}
                          className="flex items-center gap-2 font-medium text-foreground hover:text-primary hover:underline"
                        >
                          <Bot className="h-4 w-4 text-muted-foreground" />
                          {assistant.name}
                        </Link>
                      </td>
                      <td className="text-muted-foreground">{assistant.tenantName}</td>
                      <td><StatusBadge status={assistant.status} /></td>
                      <td>{assistant.conversations30d.toLocaleString()}</td>
                      <td>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {assistant.avgSatisfaction > 0 ? assistant.avgSatisfaction.toFixed(1) : "—"}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-success">{assistant.knowledgeReady}</span>
                          {assistant.knowledgeProcessing > 0 && (
                            <span className="text-primary">+{assistant.knowledgeProcessing}</span>
                          )}
                          {assistant.knowledgeError > 0 && (
                            <span className="text-destructive">({assistant.knowledgeError} err)</span>
                          )}
                        </div>
                      </td>
                      <td className="text-muted-foreground">{assistant.lastModified}</td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredAssistants.length} of {assistants.length} assistants
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
