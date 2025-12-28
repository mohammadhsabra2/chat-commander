import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tenants } from "@/data/mockData";
import { AssistantPreviewCard } from "../AssistantPreviewCard";

export interface BasicsFormData {
  name: string;
  description: string;
  instructions: string;
  tenantId: string;
  model: string;
  temperature: number;
  contextWindow: string;
  responseLength: string;
}

interface BasicsStepProps {
  data: BasicsFormData;
  onChange: (data: Partial<BasicsFormData>) => void;
  globalTenant: string;
}

const LLM_MODELS = [
  { id: "gpt-4o", name: "GPT-4o" },
  { id: "gpt-4.1", name: "GPT-4.1" },
  { id: "gemma", name: "Gemma (Local)" },
  { id: "o4-mini", name: "OpenAI o4-mini" },
];

const CONTEXT_OPTIONS = [
  { value: "2", label: "Last 2 messages" },
  { value: "5", label: "Last 5 messages" },
  { value: "10", label: "Last 10 messages" },
];

const RESPONSE_LENGTHS = [
  { value: "short", label: "Short" },
  { value: "medium", label: "Medium" },
  { value: "long", label: "Long" },
];

export function BasicsStep({ data, onChange, globalTenant }: BasicsStepProps) {
  const activeTenants = tenants.filter(t => t.status === "active");
  const selectedTenant = tenants.find(t => t.id === data.tenantId);
  
  // If global tenant is set and not "all", prefill
  const effectiveTenantId = globalTenant !== "all" ? globalTenant : data.tenantId;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Form - 2 columns */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Assistant Identity</CardTitle>
            <CardDescription>
              Configure the basic identity and behavior of your AI assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Required Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Assistant Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Customer Support Bot"
                  value={data.name}
                  onChange={(e) => onChange({ name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenant">
                  Tenant <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={effectiveTenantId}
                  onValueChange={(value) => onChange({ tenantId: value })}
                  disabled={globalTenant !== "all"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeTenants.map((tenant) => (
                      <SelectItem key={tenant.id} value={tenant.id}>
                        {tenant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {globalTenant !== "all" && (
                  <p className="text-xs text-muted-foreground">
                    Tenant selected from global filter
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">
                LLM Model <span className="text-destructive">*</span>
              </Label>
              <Select
                value={data.model}
                onValueChange={(value) => onChange({ model: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">
                General Instructions <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="instructions"
                placeholder="Describe tone, rules, what it should do, and what it must never do..."
                rows={5}
                value={data.instructions}
                onChange={(e) => onChange({ instructions: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Describe tone, rules, what it should do, and what it must never do.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what this assistant does..."
                rows={3}
                value={data.description}
                onChange={(e) => onChange({ description: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Model Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Model Settings</CardTitle>
            <CardDescription>
              Fine-tune the AI model behavior (Optional)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Temperature</Label>
                <span className="text-sm font-medium text-muted-foreground">
                  {data.temperature.toFixed(1)}
                </span>
              </div>
              <Slider
                value={[data.temperature]}
                onValueChange={(value) => onChange({ temperature: value[0] })}
                min={0}
                max={1}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Lower values make responses more focused; higher values add creativity.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Context Window</Label>
                <Select
                  value={data.contextWindow}
                  onValueChange={(value) => onChange({ contextWindow: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select context" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTEXT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Response Length</Label>
                <Select
                  value={data.responseLength}
                  onValueChange={(value) => onChange({ responseLength: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select length" />
                  </SelectTrigger>
                  <SelectContent>
                    {RESPONSE_LENGTHS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Card - 1 column */}
      <div className="lg:col-span-1">
        <AssistantPreviewCard
          name={data.name}
          model={LLM_MODELS.find(m => m.id === data.model)?.name || ""}
          instructions={data.instructions}
          tenantName={selectedTenant?.name}
        />
      </div>
    </div>
  );
}
