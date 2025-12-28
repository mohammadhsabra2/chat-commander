import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  CheckCircle,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tenants } from "@/data/mockData";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function CreateAssistantPage() {
  const navigate = useNavigate();
  const { selectedTenant } = useTenant();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    organization: selectedTenant !== "all" ? selectedTenant : "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.organization) {
        toast.error("Please fill in all required fields");
        return;
      }
    }
    setStep(step + 1);
  };

  const handleCreate = () => {
    toast.success("AI Assistant created successfully!");
    navigate("/assistants");
  };

  const handleSaveDraft = () => {
    toast.success("AI Assistant saved as draft");
    navigate("/assistants");
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/assistants">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="page-title">Create New AI Assistant</h1>
          <p className="text-muted-foreground">Set up a new chatbot for your organization</p>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-center gap-4">
          {[
            { num: 1, label: "Basic Info" },
            { num: 2, label: "Instructions" },
            { num: 3, label: "Review" },
          ].map((s, index) => (
            <div key={s.num} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                  step >= s.num
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-muted-foreground/30 text-muted-foreground"
                }`}
              >
                {step > s.num ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`ml-2 text-sm font-medium ${
                  step >= s.num ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {s.label}
              </span>
              {index < 2 && (
                <ChevronRight className="mx-4 h-5 w-5 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Enter AI Assistant Details</CardTitle>
              <CardDescription>
                Provide basic information about your new AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Customer Support Bot"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="organization">Organization *</Label>
                <Select
                  value={formData.organization}
                  onValueChange={(value) => handleInputChange("organization", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {tenants.filter(t => t.status === "active").map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Briefly describe what this assistant does..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={handleSaveDraft}>
                  Save as Draft
                </Button>
                <Button onClick={handleNext}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Instructions */}
      {step === 2 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Define Behavior & Instructions</CardTitle>
              <CardDescription>
                Set the tone, guidelines, and system behavior for your assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="instructions">System Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="You are a helpful customer support assistant. Be professional, friendly, and concise in your responses. Always verify information before providing answers..."
                  rows={8}
                  value={formData.instructions}
                  onChange={(e) => handleInputChange("instructions", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  These instructions define how the AI assistant will behave and respond to users.
                </p>
              </div>

              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="font-medium mb-2">Tips for good instructions:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Define the assistant's role clearly</li>
                  <li>• Specify the desired tone (professional, friendly, formal)</li>
                  <li>• Include any topics to avoid or handle carefully</li>
                  <li>• Set boundaries on what the assistant should/shouldn't do</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    Save as Draft
                  </Button>
                  <Button onClick={handleNext}>
                    Continue
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Review & Create</CardTitle>
              <CardDescription>
                Review the details before creating your AI assistant
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{formData.name || "Untitled Assistant"}</h3>
                  <p className="text-sm text-muted-foreground">
                    {tenants.find(t => t.id === formData.organization)?.name || "No organization selected"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1">{formData.description || "No description provided"}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Instructions</Label>
                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    {formData.instructions || "No instructions provided"}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-primary/5">
                <h4 className="font-medium mb-2">Next steps after creation:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Add knowledge sources (documents, URLs, integrations)</li>
                  <li>• Configure model settings and safety options</li>
                  <li>• Set up deployment channels</li>
                  <li>• Test the assistant before going live</li>
                </ul>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleSaveDraft}>
                    Save as Draft
                  </Button>
                  <Button onClick={handleCreate}>
                    Create & Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
