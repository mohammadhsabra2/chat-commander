import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  Eye,
  Download,
  Flag,
  Star,
  Calendar,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTenant } from "@/contexts/TenantContext";
import { StatusBadge, ChannelBadge, RoleBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { EmptyState } from "@/components/ui/empty-state";
import { conversations, conversationsPerDay, messagesPerDay, dashboardMetrics } from "@/data/mockData";

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

export default function ConversationsPage() {
  const { selectedTenant } = useTenant();
  const [activeTab, setActiveTab] = useState("logs");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [moderatedFilter, setModeratedFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const filteredConversations = conversations
    .filter((conv) => {
      const matchesSearch = 
        conv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.organization.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || conv.status === statusFilter;
      const matchesModerated = !moderatedFilter || conv.moderated;
      const matchesGlobalTenant = selectedTenant === "all" || true; // All sample data matches
      return matchesSearch && matchesStatus && matchesModerated && matchesGlobalTenant;
    })
    .sort((a, b) => {
      const dateA = new Date(a.timestamp).getTime();
      const dateB = new Date(b.timestamp).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
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
          <h1 className="page-title">Conversations</h1>
          <p className="page-description">View analytics, chat logs, and moderation</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="logs">Chat Logs</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-xs">All time</Button>
              <Button variant="ghost" size="sm" className="text-xs">7 days</Button>
              <Button variant="secondary" size="sm" className="text-xs">30 days</Button>
              <Button variant="ghost" size="sm" className="text-xs">90 days</Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Sessions"
              value={dashboardMetrics.totalConversations.toLocaleString()}
              icon={<MessageSquare className="h-5 w-5" />}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Total Users"
              value={dashboardMetrics.totalUsers.toLocaleString()}
              icon={<MessageSquare className="h-5 w-5" />}
              trend={{ value: 8, positive: true }}
            />
            <StatCard
              title="Total Messages"
              value={dashboardMetrics.totalMessages.toLocaleString()}
              icon={<MessageSquare className="h-5 w-5" />}
              trend={{ value: 15, positive: true }}
            />
            <StatCard
              title="Avg Satisfaction"
              value={dashboardMetrics.avgSatisfaction.toFixed(1)}
              icon={<Star className="h-5 w-5" />}
              subtitle="out of 5.0"
            />
          </div>

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Daily Conversations</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={conversationsPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", strokeWidth: 0, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Daily Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={messagesPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Chat Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by Chat ID, name, email, organization..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="ended">Ended</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id="moderated" 
                      checked={moderatedFilter}
                      onCheckedChange={(checked) => setModeratedFilter(checked as boolean)}
                    />
                    <label htmlFor="moderated" className="text-sm text-muted-foreground">
                      Moderated only
                    </label>
                  </div>
                  <Select value={sortOrder} onValueChange={(v: any) => setSortOrder(v)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversations Table */}
          <Card>
            <CardContent className="p-0">
              {filteredConversations.length === 0 ? (
                <div className="p-8">
                  <EmptyState
                    icon={<MessageSquare className="h-6 w-6" />}
                    title="No conversations found"
                    description="Try adjusting your filters."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Chat ID</th>
                        <th>Timestamp</th>
                        <th>User</th>
                        <th>Role</th>
                        <th>Organization</th>
                        <th>Channel</th>
                        <th>Status</th>
                        <th>Score</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredConversations.map((conv) => (
                        <motion.tr key={conv.id} variants={rowVariants}>
                          <td className="font-mono text-sm font-medium">{conv.id}</td>
                          <td className="text-muted-foreground">
                            {new Date(conv.timestamp).toLocaleString()}
                          </td>
                          <td>{conv.userName}</td>
                          <td><RoleBadge role={conv.userRole as any} /></td>
                          <td className="text-muted-foreground">{conv.organization}</td>
                          <td><ChannelBadge channel={conv.channel} /></td>
                          <td><StatusBadge status={conv.status === "active" ? "active" : "ended"} /></td>
                          <td>
                            {conv.satisfactionScore ? (
                              <span className="flex items-center gap-1">
                                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                                {conv.satisfactionScore}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
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
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="mr-2 h-4 w-4" />
                                  Export Chat
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem disabled={conv.status === "active"}>
                                  <Flag className="mr-2 h-4 w-4" />
                                  Moderate
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
        </TabsContent>

        {/* Moderation Tab */}
        <TabsContent value="moderation" className="space-y-6">
          <Card>
            <CardContent className="p-8">
              <EmptyState
                icon={<Flag className="h-6 w-6" />}
                title="Select a conversation to moderate"
                description="Choose a conversation from the Chat Logs tab to review and moderate."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
