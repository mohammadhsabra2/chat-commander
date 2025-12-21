import {
  Building2,
  Bot,
  Users,
  MessageSquare,
  Mail,
  Star,
  AlertTriangle,
  FileText,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTenant } from "@/contexts/TenantContext";
import { StatCard } from "@/components/dashboard/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dashboardMetrics,
  conversationsPerDay,
  messagesPerDay,
  channelDistribution,
  mostActiveAssistants,
  recentFlaggedConversations,
  knowledgeItems,
} from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const { selectedTenant, currentTenant } = useTenant();

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
          <h1 className="page-title">Dashboard</h1>
          <p className="page-description">
            {currentTenant 
              ? `Overview for ${currentTenant.name}` 
              : "Overview of all tenants and assistants"}
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Knowledge
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create AI Assistant
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tenants"
          value={dashboardMetrics.totalTenants}
          icon={<Building2 className="h-5 w-5" />}
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="AI Assistants"
          value={dashboardMetrics.totalAssistants}
          icon={<Bot className="h-5 w-5" />}
          trend={{ value: 8, positive: true }}
        />
        <StatCard
          title="Total Users"
          value={dashboardMetrics.totalUsers.toLocaleString()}
          icon={<Users className="h-5 w-5" />}
          trend={{ value: 23, positive: true }}
        />
        <StatCard
          title="Conversations"
          value={dashboardMetrics.totalConversations.toLocaleString()}
          icon={<MessageSquare className="h-5 w-5" />}
          trend={{ value: 15, positive: true }}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Messages"
          value={dashboardMetrics.totalMessages.toLocaleString()}
          icon={<Mail className="h-5 w-5" />}
          trend={{ value: 18, positive: true }}
        />
        <StatCard
          title="Avg Satisfaction"
          value={dashboardMetrics.avgSatisfaction.toFixed(1)}
          icon={<Star className="h-5 w-5" />}
          trend={{ value: 5, positive: true }}
          subtitle="out of 5.0"
        />
        <StatCard
          title="Flagged Conversations"
          value={dashboardMetrics.flaggedConversations}
          icon={<AlertTriangle className="h-5 w-5" />}
          trend={{ value: 3, positive: false }}
        />
        <StatCard
          title="Knowledge Items"
          value={dashboardMetrics.knowledgeReady}
          icon={<FileText className="h-5 w-5" />}
          subtitle={`${dashboardMetrics.knowledgeProcessing} processing, ${dashboardMetrics.knowledgeError} errors`}
        />
      </motion.div>

      {/* Charts Section */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Conversations Line Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Conversations per Day</CardTitle>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="text-xs">7d</Button>
              <Button variant="secondary" size="sm" className="text-xs">30d</Button>
              <Button variant="ghost" size="sm" className="text-xs">90d</Button>
            </div>
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
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Messages Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Messages per Day</CardTitle>
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
      </motion.div>

      {/* Channel Distribution & Active Assistants */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-3">
        {/* Channel Distribution Pie */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={channelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {channelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Active Assistants */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Most Active Assistants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assistant</th>
                    <th>Tenant</th>
                    <th>Conversations</th>
                    <th>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {mostActiveAssistants.map((assistant, index) => (
                    <tr key={index}>
                      <td className="font-medium">{assistant.name}</td>
                      <td className="text-muted-foreground">{assistant.tenant}</td>
                      <td>{assistant.conversations.toLocaleString()}</td>
                      <td>
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                          {assistant.avgScore}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Flagged Conversations & Knowledge Status */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
        {/* Flagged Conversations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Recent Flagged Conversations</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentFlaggedConversations.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{item.chatId}</p>
                    <p className="text-xs text-muted-foreground">{item.tenant} • {item.reason}</p>
                  </div>
                  <StatusBadge status={item.status === "pending" ? "processing" : "ready"} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Ingestion Status */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-medium">Knowledge Ingestion Status</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Assistant</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {knowledgeItems.slice(0, 4).map((item) => (
                    <tr key={item.id}>
                      <td className="max-w-[150px] truncate font-medium">{item.name}</td>
                      <td className="text-muted-foreground">{item.assistantName}</td>
                      <td><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
