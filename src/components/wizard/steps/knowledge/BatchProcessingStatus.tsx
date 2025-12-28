import { useState } from "react";
import { CheckCircle, Clock, Loader2, FileJson, Copy, Download, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { KnowledgeBatch } from "./types";

interface BatchProcessingStatusProps {
  batch: KnowledgeBatch;
  onComplete: () => void;
  isComplete: boolean;
}

const PROCESSING_STEPS = [
  { id: "scraped", label: "Files Scraped" },
  { id: "topics_approved", label: "Topics Approved" },
  { id: "embeddings", label: "Embeddings Processing" },
  { id: "indexed", label: "Indexed" },
];

export function BatchProcessingStatus({
  batch,
  onComplete,
  isComplete,
}: BatchProcessingStatusProps) {
  const [showJsonViewer, setShowJsonViewer] = useState(false);

  const currentStepIndex = isComplete ? 4 : 2;
  const approvedTopicsCount = batch.topics.length;
  const deletedTopicsCount = 10 - approvedTopicsCount; // Assuming we started with 10

  const batchJson = {
    batchId: batch.id,
    assistantId: "asst_draft_01",
    accessLevel: batch.accessLevel.charAt(0).toUpperCase() + batch.accessLevel.slice(1),
    tags: batch.tags,
    files: batch.files.map((f) => ({
      name: f.name,
      status: isComplete ? "indexed" : "processing",
    })),
    topics: batch.topics.map((t) => ({
      name: t.name,
      confidence: t.confidence,
    })),
    status: isComplete ? "ready" : "processing",
    createdAt: batch.createdAt,
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(batchJson, null, 2));
    toast.success("JSON copied to clipboard");
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(batchJson, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${batch.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("JSON file downloaded");
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {isComplete ? (
                  <CheckCircle className="h-5 w-5 text-success" />
                ) : (
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                )}
                Batch: {batch.id}
              </CardTitle>
              <CardDescription>
                {isComplete
                  ? "Knowledge batch is ready and indexed"
                  : "Processing embeddings..."}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={
                isComplete
                  ? "bg-success/10 text-success border-success/20"
                  : "bg-primary/10 text-primary border-primary/20"
              }
            >
              {isComplete ? "Ready" : "Processing"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress Steps */}
          <div className="space-y-3">
            {PROCESSING_STEPS.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex - 1 && !isComplete;

              return (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                      isCompleted
                        ? "bg-success text-success-foreground"
                        : isCurrent
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : isCurrent ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <span
                    className={`text-sm ${
                      isCompleted || isCurrent
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </span>
                  {isCompleted && (
                    <span className="text-xs text-success ml-auto">✓</span>
                  )}
                </div>
              );
            })}
          </div>

          {!isComplete && (
            <Progress value={65} className="h-2" />
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-lg bg-muted/50">
            <div className="text-center">
              <p className="text-2xl font-bold">{batch.files.length}</p>
              <p className="text-xs text-muted-foreground">Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-success">{approvedTopicsCount}</p>
              <p className="text-xs text-muted-foreground">Approved Topics</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-muted-foreground">{deletedTopicsCount}</p>
              <p className="text-xs text-muted-foreground">Deleted Topics</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold capitalize">{batch.accessLevel}</p>
              <p className="text-xs text-muted-foreground">Access Level</p>
            </div>
          </div>

          {/* Actions */}
          {isComplete && (
            <div className="flex flex-wrap gap-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowJsonViewer(true)}
                className="gap-2"
              >
                <FileJson className="h-4 w-4" />
                View Batch Knowledge (JSON)
              </Button>
              <Button variant="outline" className="gap-2">
                <Pencil className="h-4 w-4" />
                Edit Batch
              </Button>
              <Button variant="outline" className="gap-2 text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete Batch
              </Button>
              <Button onClick={onComplete} className="ml-auto">
                Continue to Library
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* JSON Viewer Dialog */}
      <Dialog open={showJsonViewer} onOpenChange={setShowJsonViewer}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Batch Knowledge: {batch.id}</DialogTitle>
            <DialogDescription>
              JSON representation of the knowledge batch data
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="p-4 rounded-lg bg-muted/50 text-sm overflow-auto max-h-[400px] scrollbar-thin">
              {JSON.stringify(batchJson, null, 2)}
            </pre>
            <div className="absolute top-2 right-2 flex gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopyJson}>
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button variant="secondary" size="sm" onClick={handleDownloadJson}>
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
