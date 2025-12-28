import { Bot } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

interface AssistantPreviewCardProps {
  name: string;
  model: string;
  instructions: string;
  tenantName?: string;
}

export function AssistantPreviewCard({ 
  name, 
  model, 
  instructions, 
  tenantName 
}: AssistantPreviewCardProps) {
  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Live Preview
          </CardTitle>
          <StatusBadge status="draft" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">
              {name || "Untitled Assistant"}
            </h3>
            {tenantName && (
              <p className="text-xs text-muted-foreground truncate">
                {tenantName}
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-3 pt-2 border-t border-border">
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-1">
              Model
            </span>
            <span className="text-sm font-medium">
              {model || "Not selected"}
            </span>
          </div>
          
          <div>
            <span className="text-xs font-medium text-muted-foreground block mb-1">
              System Instruction Preview
            </span>
            <p className="text-xs text-muted-foreground line-clamp-4 bg-muted/50 rounded-md p-2">
              {instructions 
                ? instructions.substring(0, 150) + (instructions.length > 150 ? "..." : "")
                : "No instructions defined yet..."}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
