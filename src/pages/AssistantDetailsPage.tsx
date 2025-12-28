import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  BookOpen,
  Settings2,
  Workflow,
  Globe,
  BarChart3,
  Plus,
  Upload,
  Link as LinkIcon,
  Cloud,
  Trash2,
  RefreshCw,
  Eye,
  Play,
  Save,
  Star,
  MessageSquare,
  Users,
  FileText,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/ui/status-badge";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/dashboard/StatCard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assistants, knowledgeItems } from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

// Mock workflow data
const workflows = [
  { id: "w1", name: "Welcome Flow", status: "published", triggers: ["hello", "hi", "start"], steps: 5 },
  { id: "w2", name: "Product Inquiry", status: "draft", triggers: ["product", "pricing"], steps: 8 },
  { id: "w3", name: "Support Escalation", status: "published", triggers: ["human", "agent", "help"], steps: 4 },
];

export default function AssistantDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const [temperature, setTemperature] = useState([0.7]);
  const [addKnowledgeOpen, setAddKnowledgeOpen] = useState(false);

  const assistant = assistants.find((a) => a.id === id);
  const assistantKnowledge = knowledgeItems.filter((k) => k.assistantId === id);

  if (!assistant) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <Bot className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold">Assistant not found</h2>
        <Button asChild variant="outline">
          <Link to="/assistants">Back to Assistants</Link>
        </Button>
      </div>
    );
  }

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case "public": return "default";
      case "employee": return "secondary";
      case "executive": return "destructive";
      default: return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready": return "text-success";
      case "processing": return "text-primary";
      case "error": return "text-destructive";
      default: return "text-muted-foreground";
    }
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
          <Link to="/assistants">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <Bot className="h-6 w-6 text-muted-foreground" />
            <h1 className="page-title">{assistant.name}</h1>
            <StatusBadge status={assistant.status} />
          </div>
          <p className="text-muted-foreground">{assistant.tenantName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Play className="mr-2 h-4 w-4" />
            Test Chat
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap h-auto">
          <TabsTrigger value="overview" className="gap-2">
            <Bot className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="knowledge" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Knowledge
          </TabsTrigger>
          <TabsTrigger value="model" className="gap-2">
            <Settings2 className="h-4 w-4" />
            Model Settings
          </TabsTrigger>
          <TabsTrigger value="workflows" className="gap-2">
            <Workflow className="h-4 w-4" />
            Workflows
          </TabsTrigger>
          <TabsTrigger value="deployment" className="gap-2">
            <Globe className="h-4 w-4" />
            Deployment
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>AI Assistant Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input defaultValue={assistant.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Organization</Label>
                    <Input defaultValue={assistant.tenantName} readOnly />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea defaultValue={assistant.description} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Instructions (System Behavior)</Label>
                  <Textarea 
                    defaultValue={assistant.instructions} 
                    rows={4}
                    placeholder="Define how the assistant should behave, its tone, and any specific guidelines..."
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Status</Label>
                    <p className="text-sm text-muted-foreground">Toggle to activate or deactivate the assistant</p>
                  </div>
                  <Switch checked={assistant.status === "active"} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Conversations (30d)"
              value={assistant.conversations30d}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: 12, positive: true }}
            />
            <StatCard
              title="Avg Satisfaction"
              value={assistant.avgSatisfaction.toFixed(1)}
              icon={<Star className="h-4 w-4" />}
            />
            <StatCard
              title="Knowledge Items"
              value={assistant.knowledgeReady}
              icon={<FileText className="h-4 w-4" />}
            />
            <StatCard
              title="Active Users"
              value={245}
              icon={<Users className="h-4 w-4" />}
            />
          </motion.div>
        </TabsContent>

        {/* Knowledge Tab */}
        <TabsContent value="knowledge" className="space-y-6">
          {/* Add Knowledge Section */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Add Knowledge</CardTitle>
                <CardDescription>Upload files or connect data sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <Dialog open={addKnowledgeOpen} onOpenChange={setAddKnowledgeOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="h-24 flex-col gap-2">
                        <Upload className="h-6 w-6" />
                        Upload File
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Upload Knowledge File</DialogTitle>
                        <DialogDescription>
                          Upload PDF, DOCX, TXT, or other document files
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed rounded-lg p-8 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Drag and drop files here, or click to browse
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label>Access Level</Label>
                          <Select defaultValue="public">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="public">Public (Anonymous/Guest)</SelectItem>
                              <SelectItem value="employee">Employee</SelectItem>
                              <SelectItem value="executive">Executive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Tags</Label>
                          <Input placeholder="product, faq, support" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddKnowledgeOpen(false)}>Cancel</Button>
                        <Button onClick={() => setAddKnowledgeOpen(false)}>Upload</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Cloud className="h-6 w-6" />
                    OneDrive
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Cloud className="h-6 w-6" />
                    Google Drive
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <Cloud className="h-6 w-6" />
                    SharePoint
                  </Button>
                  <Button variant="outline" className="h-24 flex-col gap-2">
                    <LinkIcon className="h-6 w-6" />
                    Add URLs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search & Filter */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Knowledge Library</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Input placeholder="Search knowledge..." className="flex-1" />
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Source Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="file">File</SelectItem>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="sharepoint">SharePoint</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Access Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Levels</SelectItem>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="overflow-x-auto">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Access Level</th>
                        <th>Last Modified</th>
                        <th className="w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {assistantKnowledge.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-muted-foreground">
                            No knowledge items yet. Add some using the buttons above.
                          </td>
                        </tr>
                      ) : (
                        assistantKnowledge.map((item) => (
                          <tr key={item.id}>
                            <td className="font-medium">{item.name}</td>
                            <td className="capitalize text-muted-foreground">{item.type}</td>
                            <td>
                              <span className={`font-medium ${getStatusColor(item.status)}`}>
                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                              </span>
                            </td>
                            <td>
                              <Badge variant={getAccessLevelColor(item.accessLevel) as any}>
                                {item.accessLevel}
                              </Badge>
                            </td>
                            <td className="text-muted-foreground">{item.lastModified}</td>
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
                                    View
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                    Re-ingest
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Model Settings Tab */}
        <TabsContent value="model" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>LLM Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select defaultValue="gpt4o">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt4o">GPT-4o</SelectItem>
                      <SelectItem value="gpt4">GPT-4</SelectItem>
                      <SelectItem value="gemma">Gemma 2</SelectItem>
                      <SelectItem value="claude">Claude 3.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Temperature</Label>
                    <span className="text-sm text-muted-foreground">{temperature[0]}</span>
                  </div>
                  <Slider
                    value={temperature}
                    onValueChange={setTemperature}
                    max={1}
                    step={0.1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values make responses more focused and deterministic
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Context Messages</Label>
                  <Select defaultValue="3">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 messages back</SelectItem>
                      <SelectItem value="3">3 messages back</SelectItem>
                      <SelectItem value="4">4 messages back</SelectItem>
                      <SelectItem value="5">5 messages back</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Max Response Length</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short">Short (~100 tokens)</SelectItem>
                      <SelectItem value="medium">Medium (~300 tokens)</SelectItem>
                      <SelectItem value="long">Long (~500 tokens)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety & Moderation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Content Moderation</Label>
                    <p className="text-sm text-muted-foreground">Filter inappropriate content</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>PII Detection</Label>
                    <p className="text-sm text-muted-foreground">Warn when PII is detected</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Hallucination Guard</Label>
                    <p className="text-sm text-muted-foreground">Reduce made-up information</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="pt-4 flex gap-2">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Reset Defaults</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Workflows Tab */}
        <TabsContent value="workflows" className="space-y-6">
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Workflows & Topics</h2>
              <p className="text-sm text-muted-foreground">Define conversation flows and trigger phrases</p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Workflow
            </Button>
          </motion.div>

          <motion.div variants={itemVariants} className="grid gap-4">
            {workflows.map((workflow) => (
              <Card key={workflow.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Workflow className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{workflow.name}</h3>
                          <Badge variant={workflow.status === "published" ? "default" : "secondary"}>
                            {workflow.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Triggers: {workflow.triggers.join(", ")} • {workflow.steps} steps
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </TabsContent>

        {/* Deployment Tab */}
        <TabsContent value="deployment" className="space-y-6">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Website Widget</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Widget Name</Label>
                    <Input defaultValue={assistant.name} />
                  </div>
                  <div className="space-y-2">
                    <Label>Allowed Domains</Label>
                    <Input placeholder="example.com, app.example.com" />
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Public Mode</Label>
                    <p className="text-sm text-muted-foreground">Anonymous users access public knowledge only</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <Label>Auth Mode</Label>
                    <p className="text-sm text-muted-foreground">Signed-in users access role-based knowledge</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="space-y-2">
                  <Label>Embed Snippet</Label>
                  <pre className="rounded-lg bg-muted p-4 text-sm overflow-x-auto">
{`<script src="https://chat.example.com/widget.js"></script>
<script>
  ChatWidget.init({ 
    assistantId: "${assistant.id}",
    theme: "light"
  });
</script>`}
                  </pre>
                  <Button variant="outline" size="sm">Copy Snippet</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle>Channel Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Website", enabled: true },
                    { name: "Microsoft Teams", enabled: false },
                    { name: "WhatsApp", enabled: false },
                    { name: "Telegram", enabled: false },
                  ].map((channel) => (
                    <div key={channel.name} className="flex items-center justify-between rounded-lg border p-4">
                      <span className="font-medium">{channel.name}</span>
                      <Switch checked={channel.enabled} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-4">
            <StatCard
              title="Conversations"
              value={assistant.conversations30d}
              icon={<MessageSquare className="h-4 w-4" />}
              trend={{ value: 15, positive: true }}
            />
            <StatCard
              title="Messages"
              value={assistant.conversations30d * 8}
              icon={<Send className="h-4 w-4" />}
            />
            <StatCard
              title="Avg Satisfaction"
              value={assistant.avgSatisfaction.toFixed(1)}
              icon={<Star className="h-4 w-4" />}
              trend={{ value: 0.2, positive: true }}
            />
            <StatCard
              title="Knowledge Usage"
              value="78%"
              icon={<BookOpen className="h-4 w-4" />}
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Top Questions</CardTitle>
                  <Select defaultValue="7">
                    <SelectTrigger className="w-[150px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { question: "How do I reset my password?", count: 145 },
                    { question: "What are your pricing plans?", count: 98 },
                    { question: "How can I contact support?", count: 76 },
                    { question: "Where can I find documentation?", count: 54 },
                    { question: "How do I cancel my subscription?", count: 43 },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{item.question}</span>
                      <Badge variant="outline">{item.count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Button asChild variant="outline">
              <Link to={`/conversations?assistant=${assistant.id}`}>
                View All Conversations
              </Link>
            </Button>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
