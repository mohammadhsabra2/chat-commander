import { Bot, AlertTriangle, CheckCircle, FileText, Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { tenants } from "@/data/mockData";
import { BasicsFormData } from "./BasicsStep";
import { KnowledgeBatch } from "./knowledge/types";

interface ReviewStepProps {
  basicsData: BasicsFormData;
  batches: KnowledgeBatch[];
}

const LLM_MODELS: Record<string, string> = {
  "gpt-4o": "GPT-4o",
  "gpt-4.1": "GPT-4.1",
  "gemma": "Gemma (Local)",
  "o4-mini": "OpenAI o4-mini",
};

export function ReviewStep({ basicsData, batches }: ReviewStepProps) {
  const tenant = tenants.find((t) => t.id === basicsData.tenantId);
  const hasProcessingBatches = batches.some((b) => b.status !== "ready");
  const totalTopics = batches.reduce((sum, b) => sum + b.topics.length, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Review & Create</h2>
        <p className="text-sm text-muted-foreground">
          Review the details before creating your AI assistant
        </p>
      </div>

      {/* Warning Banner */}
      {hasProcessingBatches && (
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertDescription className="text-warning">
            You can create the assistant now, but knowledge will become
            available when indexing finishes.
          </AlertDescription>
        </Alert>
      )}

      {/* Assistant Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assistant Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-4 p-4 rounded-lg bg-muted/50">
            <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg">
                  {basicsData.name || "Untitled Assistant"}
                </h3>
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  Draft
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {tenant?.name || "No tenant selected"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-1">
                Model
              </span>
              <span className="font-medium">
                {LLM_MODELS[basicsData.model] || "Not selected"}
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-1">
                Temperature
              </span>
              <span className="font-medium">{basicsData.temperature.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-1">
                Context Window
              </span>
              <span className="font-medium">
                Last {basicsData.contextWindow} messages
              </span>
            </div>
            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-1">
                Response Length
              </span>
              <span className="font-medium capitalize">{basicsData.responseLength}</span>
            </div>
          </div>

          {basicsData.description && (
            <div>
              <span className="text-xs font-medium text-muted-foreground block mb-1">
                Description
              </span>
              <p className="text-sm">{basicsData.description}</p>
            </div>
          )}

          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-1">
              Instructions
            </span>
            <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap max-h-32 overflow-y-auto scrollbar-thin">
              {basicsData.instructions || "No instructions provided"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Knowledge Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Knowledge Summary</CardTitle>
          <CardDescription>
            {batches.length} batch{batches.length !== 1 ? "es" : ""} •{" "}
            {totalTopics} topics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {batches.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No knowledge batches added</p>
              <p className="text-xs mt-1">
                You can add knowledge after creating the assistant
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {batches.map((batch) => (
                <div
                  key={batch.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  {batch.type === "documents" ? (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Globe className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{batch.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {batch.topics.length} topics •{" "}
                      {batch.type === "documents"
                        ? `${batch.files.length} files`
                        : "Website crawl"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      batch.status === "ready"
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-primary/10 text-primary border-primary/20"
                    }
                  >
                    {batch.status === "ready" ? (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Ready
                      </>
                    ) : (
                      "Processing"
                    )}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Next steps after creation</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Configure deployment channels (Website, Teams, WhatsApp)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Test the assistant in the playground
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Set up workflows and custom topics
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Monitor analytics and conversations
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
