import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  User,
  Activity,
  Shield,
  MessageSquare,
  Mail,
  Phone,
  Building2,
  Calendar,
  Globe,
  MapPin,
  CheckCircle,
  XCircle,
  Ban,
  Trash2,
  FileText,
  Flag,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge, RoleBadge } from "@/components/ui/status-badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { users, conversations } from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function UserProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("general");

  const user = users.find((u) => u.id === id);
  const userConversations = conversations.filter((c) => c.userId === id);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <User className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">User not found</h2>
        <Button asChild variant="outline">
          <Link to="/users">Back to Users</Link>
        </Button>
      </div>
    );
  }

  // Mock additional user data
  const userDetails = {
    mobile: "+1 (555) 123-4567",
    loginType: "Email/Password",
    joinedOn: "2024-01-15",
    browserIp: "192.168.1.100",
    location: "San Francisco, CA",
    totalMessages: 456,
    avgMessagesPerChat: 8.5,
    flowsTriggered: 23,
    documentsUploaded: 5,
    flaggedConversations: 1,
    summariesSent: 12,
  };

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
          <Link to="/users">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="page-title">{user.name}</h1>
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
              <p className="text-muted-foreground">{user.organization}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Ban className="mr-2 h-4 w-4" />
            {user.status === "restricted" ? "Unrestrict" : "Restrict"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User Data</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all data associated with {user.name}. 
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="general" className="gap-2">
            <User className="h-4 w-4" />
            General Info
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <Activity className="h-4 w-4" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-2">
            <Shield className="h-4 w-4" />
            Access & Roles
          </TabsTrigger>
          <TabsTrigger value="conversations" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            Conversations
          </TabsTrigger>
        </TabsList>

        {/* General Info Tab */}
        <TabsContent value="general" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>User Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">User ID</Label>
                        <p className="font-mono text-sm">{user.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Name</Label>
                        <p>{user.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Email</Label>
                        <div className="flex items-center gap-2">
                          <p>{user.email}</p>
                          {user.emailVerified ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Mobile</Label>
                        <div className="flex items-center gap-2">
                          <p>{userDetails.mobile}</p>
                          {user.mobileVerified ? (
                            <CheckCircle className="h-4 w-4 text-success" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Role</Label>
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Organization</Label>
                        <p>{user.organization}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Login Type</Label>
                        <p>{userDetails.loginType}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <Label className="text-muted-foreground">Joined</Label>
                        <p>{userDetails.joinedOn}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Authentication Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-muted-foreground">Browser IP</Label>
                      <p className="font-mono text-sm">{userDetails.browserIp}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <Label className="text-muted-foreground">Location</Label>
                      <p>{userDetails.location}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Total Conversations"
              value={user.totalConversations}
              icon={<MessageSquare className="h-4 w-4" />}
            />
            <StatCard
              title="Total Messages"
              value={userDetails.totalMessages}
              icon={<Send className="h-4 w-4" />}
            />
            <StatCard
              title="Avg Messages/Chat"
              value={userDetails.avgMessagesPerChat.toFixed(1)}
              icon={<Activity className="h-4 w-4" />}
            />
            <StatCard
              title="Flows Triggered"
              value={userDetails.flowsTriggered}
              icon={<Activity className="h-4 w-4" />}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-3">
            <StatCard
              title="Documents Uploaded"
              value={userDetails.documentsUploaded}
              icon={<FileText className="h-4 w-4" />}
            />
            <StatCard
              title="Flagged Conversations"
              value={userDetails.flaggedConversations}
              icon={<Flag className="h-4 w-4" />}
            />
            <StatCard
              title="Summaries Sent"
              value={userDetails.summariesSent}
              icon={<Send className="h-4 w-4" />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { time: "2 hours ago", action: "Started conversation with Customer Support Bot" },
                    { time: "Yesterday", action: "Uploaded document: Q1 Report.pdf" },
                    { time: "2 days ago", action: "Completed conversation with Sales Assistant" },
                    { time: "3 days ago", action: "Updated profile information" },
                    { time: "1 week ago", action: "First login to the platform" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground w-24">{activity.time}</span>
                      <span className="text-sm">{activity.action}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="flex gap-2">
            <Button variant="outline">
              <Ban className="mr-2 h-4 w-4" />
              Deactivate User
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete User Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete User Data</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action will permanently delete all user data including conversations, 
                    uploaded documents, and activity history. This cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground">
                    Delete All Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </motion.div>
        </TabsContent>

        {/* Access & Roles Tab */}
        <TabsContent value="access" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Role Assignment</CardTitle>
                <CardDescription>Manage user's role and permissions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Role</Label>
                  <Select defaultValue={user.role}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="guest">Guest</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Access Authenticated Knowledge</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow access to role-restricted knowledge bases
                    </p>
                  </div>
                  <Switch defaultChecked={user.role !== "guest"} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Effective Permissions</CardTitle>
                <CardDescription>Permissions granted by the current role</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2">
                  {[
                    { name: "View public knowledge", granted: true },
                    { name: "View employee knowledge", granted: user.role !== "guest" },
                    { name: "View executive knowledge", granted: user.role === "admin" },
                    { name: "Start conversations", granted: true },
                    { name: "Upload documents", granted: user.role !== "guest" },
                    { name: "View conversation history", granted: true },
                    { name: "Moderate chats", granted: user.role === "moderator" || user.role === "admin" },
                    { name: "Manage users", granted: user.role === "admin" },
                  ].map((permission, index) => (
                    <div key={index} className="flex items-center gap-2">
                      {permission.granted ? (
                        <CheckCircle className="h-4 w-4 text-success" />
                      ) : (
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={permission.granted ? "" : "text-muted-foreground"}>
                        {permission.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Conversations Tab */}
        <TabsContent value="conversations" className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Conversation History</CardTitle>
                <CardDescription>All conversations by this user</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Chat ID</th>
                      <th>Assistant</th>
                      <th>Channel</th>
                      <th>Status</th>
                      <th>Messages</th>
                      <th>Satisfaction</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userConversations.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          No conversations found
                        </td>
                      </tr>
                    ) : (
                      userConversations.map((conversation) => (
                        <tr key={conversation.id}>
                          <td className="font-mono text-xs">{conversation.id}</td>
                          <td>{conversation.assistantName}</td>
                          <td className="capitalize">{conversation.channel}</td>
                          <td><StatusBadge status={conversation.status} /></td>
                          <td>{conversation.messagesCount}</td>
                          <td>
                            {conversation.satisfactionScore ? (
                              <span className="flex items-center gap-1">
                                ⭐ {conversation.satisfactionScore}
                              </span>
                            ) : "—"}
                          </td>
                          <td className="text-muted-foreground">
                            {new Date(conversation.timestamp).toLocaleDateString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
