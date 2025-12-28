import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Users,
  Bot,
  Globe,
  ClipboardList,
  MoreHorizontal,
  Plus,
  Mail,
  Download,
  Settings,
  CheckCircle,
  XCircle,
  MessageSquare,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, RoleBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { tenants, users, assistants, conversations } from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function TenantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");

  const tenant = tenants.find((t) => t.id === id);
  const tenantUsers = users.filter((u) => u.tenantId === id);
  const tenantAssistants = assistants.filter((a) => a.tenantId === id);
  const tenantConversations = conversations.filter((c) => 
    tenantAssistants.some((a) => a.id === c.assistantId)
  );

  if (!tenant) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Building2 className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Tenant not found</h2>
        <Button asChild variant="outline">
          <Link to="/tenants">Back to Tenants</Link>
        </Button>
      </div>
    );
  }

  const avgSatisfaction = tenantAssistants.reduce((sum, a) => sum + a.avgSatisfaction, 0) / 
    (tenantAssistants.length || 1);

  // Mock audit log data
  const auditLog = [
    { id: 1, timestamp: "2024-03-18 14:30", actor: "John Smith", action: "Updated", objectType: "Assistant", objectId: "a1" },
    { id: 2, timestamp: "2024-03-18 10:15", actor: "Sarah Johnson", action: "Created", objectType: "Knowledge", objectId: "k2" },
    { id: 3, timestamp: "2024-03-17 16:45", actor: "John Smith", action: "Invited", objectType: "User", objectId: "u3" },
    { id: 4, timestamp: "2024-03-17 09:00", actor: "Admin", action: "Modified", objectType: "Settings", objectId: "s1" },
    { id: 5, timestamp: "2024-03-16 11:30", actor: "Sarah Johnson", action: "Deleted", objectType: "Knowledge", objectId: "k5" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/tenants">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="page-title">{tenant.name}</h1>
            <StatusBadge status={tenant.status} />
          </div>
          <p className="text-muted-foreground">{tenant.domain}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Tenant</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Suspend Tenant</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview" className="gap-2">
            <Building2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="assistants" className="gap-2">
            <Bot className="h-4 w-4" />
            Assistants
          </TabsTrigger>
          <TabsTrigger value="channels" className="gap-2">
            <Globe className="h-4 w-4" />
            Channels
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <ClipboardList className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total Users"
              value={tenantUsers.length}
              icon={<Users className="h-4 w-4" />}
            />
            <StatCard
              title="AI Assistants"
              value={tenantAssistants.length}
              icon={<Bot className="h-4 w-4" />}
            />
            <StatCard
              title="Conversations"
              value={tenantConversations.length}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Avg Satisfaction"
              value={avgSatisfaction.toFixed(1)}
              icon={<Star className="h-4 w-4" />}
              trend={{ value: 0.3, positive: true }}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Tenant Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Tenant ID</Label>
                  <p className="font-mono text-sm">{tenant.id}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Primary Domain</Label>
                  <p>{tenant.domain}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Created</Label>
                  <p>{tenant.createdAt}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Status</Label>
                  <StatusBadge status={tenant.status} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {auditLog.slice(0, 3).map((log) => (
                    <div key={log.id} className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">{log.timestamp}</span>
                      <span className="font-medium">{log.actor}</span>
                      <span className="text-muted-foreground">{log.action}</span>
                      <span>{log.objectType}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-sm">
              <Input placeholder="Search users..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button>
                <Mail className="mr-2 h-4 w-4" />
                Invite User
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Last Active</th>
                    <th>Status</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {tenantUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="font-medium">
                        <Link to={`/users/${user.id}`} className="hover:text-primary hover:underline">
                          {user.name}
                        </Link>
                      </td>
                      <td>
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">{user.email}</span>
                          {user.emailVerified ? (
                            <CheckCircle className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td><RoleBadge role={user.role} /></td>
                      <td className="text-muted-foreground">{user.lastActive}</td>
                      <td><StatusBadge status={user.status} /></td>
                      <td>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Restrict</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assistants Tab */}
        <TabsContent value="assistants" className="space-y-4">
          <div className="flex items-center justify-between">
            <Input placeholder="Search assistants..." className="max-w-sm" />
            <Button asChild>
              <Link to="/assistants/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Assistant
              </Link>
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Assistant Name</th>
                    <th>Status</th>
                    <th>Conversations (30d)</th>
                    <th>Knowledge Items</th>
                    <th>Last Modified</th>
                    <th className="w-12"></th>
                  </tr>
                </thead>
                <tbody>
                  {tenantAssistants.map((assistant) => (
                    <tr key={assistant.id}>
                      <td>
                        <Link
                          to={`/assistants/${assistant.id}`}
                          className="flex items-center gap-2 font-medium hover:text-primary hover:underline"
                        >
                          <Bot className="h-4 w-4 text-muted-foreground" />
                          {assistant.name}
                        </Link>
                      </td>
                      <td><StatusBadge status={assistant.status} /></td>
                      <td>{assistant.conversations30d}</td>
                      <td>
                        <span className="text-success">{assistant.knowledgeReady}</span>
                        {assistant.knowledgeProcessing > 0 && (
                          <span className="text-primary"> +{assistant.knowledgeProcessing}</span>
                        )}
                      </td>
                      <td className="text-muted-foreground">{assistant.lastModified}</td>
                      <td>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Channels Tab */}
        <TabsContent value="channels" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Website Widget</CardTitle>
              <CardDescription>Configure the chatbot widget for your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Widget ID</Label>
                  <Input value={`widget_${tenant.id}`} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Allowed Domains</Label>
                  <Input value={tenant.domain} />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Public Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow anonymous users to access public knowledge</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <Label>Authenticated Mode</Label>
                  <p className="text-sm text-muted-foreground">Allow signed-in users to access role-based knowledge</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Embed Snippet</Label>
                <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
{`<script src="https://chat.example.com/widget.js"></script>
<script>
  ChatWidget.init({ widgetId: "widget_${tenant.id}" });
</script>`}
                </pre>
                <Button variant="outline" size="sm">Copy Snippet</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Channel Integrations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Website", enabled: true, icon: "🌐" },
                  { name: "Microsoft Teams", enabled: true, icon: "💬" },
                  { name: "WhatsApp", enabled: false, icon: "📱" },
                  { name: "Telegram", enabled: false, icon: "✈️" },
                ].map((channel) => (
                  <div key={channel.name} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{channel.icon}</span>
                      <div>
                        <p className="font-medium">{channel.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {channel.enabled ? "Connected and active" : "Not configured"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={channel.enabled} />
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Track all changes made within this tenant</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Object Type</th>
                    <th>Object ID</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLog.map((log) => (
                    <tr key={log.id}>
                      <td className="text-muted-foreground">{log.timestamp}</td>
                      <td className="font-medium">{log.actor}</td>
                      <td>{log.action}</td>
                      <td>{log.objectType}</td>
                      <td className="font-mono text-xs">{log.objectId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
