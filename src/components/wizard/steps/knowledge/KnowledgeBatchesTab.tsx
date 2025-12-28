import { useState } from "react";
import { FileJson, Pencil, RefreshCw, Trash2, MoreHorizontal, FileText, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { KnowledgeBatch, DUMMY_BATCHES } from "./types";
import { EmptyState } from "@/components/ui/empty-state";

interface KnowledgeBatchesTabProps {
  batches: KnowledgeBatch[];
  onUpdateBatch: (batch: KnowledgeBatch) => void;
  onDeleteBatch: (batchId: string) => void;
}

export function KnowledgeBatchesTab({
  batches,
  onUpdateBatch,
  onDeleteBatch,
}: KnowledgeBatchesTabProps) {
  const [showJsonViewer, setShowJsonViewer] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<KnowledgeBatch | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [batchToDelete, setBatchToDelete] = useState<string | null>(null);

  // Combine user batches with dummy batches for demo
  const allBatches = [...batches, ...DUMMY_BATCHES.filter(
    db => !batches.some(b => b.id === db.id)
  )];

  const handleViewJson = (batch: KnowledgeBatch) => {
    setSelectedBatch(batch);
    setShowJsonViewer(true);
  };

  const handleDelete = (batchId: string) => {
    setBatchToDelete(batchId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (batchToDelete) {
      onDeleteBatch(batchToDelete);
      toast.success("Batch deleted successfully");
    }
    setShowDeleteConfirm(false);
    setBatchToDelete(null);
  };

  const handleRerunExtraction = (batch: KnowledgeBatch) => {
    toast.info(`Re-running topic extraction for ${batch.name}...`);
  };

  const getStatusBadge = (status: KnowledgeBatch["status"]) => {
    const styles: Record<typeof status, string> = {
      ready: "bg-success/10 text-success border-success/20",
      processing: "bg-primary/10 text-primary border-primary/20",
      embedding: "bg-primary/10 text-primary border-primary/20",
      uploading: "bg-primary/10 text-primary border-primary/20",
      awaiting_approval: "bg-warning/10 text-warning border-warning/20",
      error: "bg-destructive/10 text-destructive border-destructive/20",
    };
    const labels: Record<typeof status, string> = {
      ready: "Ready",
      processing: "Processing",
      embedding: "Embedding",
      uploading: "Uploading",
      awaiting_approval: "Awaiting Approval",
      error: "Error",
    };
    return (
      <Badge variant="outline" className={styles[status]}>
        {labels[status]}
      </Badge>
    );
  };

  const getAccessBadge = (accessLevel: KnowledgeBatch["accessLevel"]) => {
    const styles: Record<typeof accessLevel, string> = {
      public: "bg-chart-2/10 text-chart-2",
      employee: "bg-chart-1/10 text-chart-1",
      executive: "bg-chart-4/10 text-chart-4",
      custom: "bg-chart-5/10 text-chart-5",
    };
    return (
      <Badge variant="secondary" className={styles[accessLevel]}>
        {accessLevel.charAt(0).toUpperCase() + accessLevel.slice(1)}
      </Badge>
    );
  };

  if (allBatches.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <p className="font-medium">No Knowledge Batches</p>
        <p className="text-sm mt-1">Upload documents or crawl websites to create knowledge batches</p>
      </div>
    );
  }

  const batchJson = selectedBatch ? {
    batchId: selectedBatch.id,
    assistantId: "asst_draft_01",
    accessLevel: selectedBatch.accessLevel.charAt(0).toUpperCase() + selectedBatch.accessLevel.slice(1),
    tags: selectedBatch.tags,
    files: selectedBatch.files.map((f) => ({
      name: f.name,
      status: "indexed",
    })),
    topics: selectedBatch.topics.map((t) => ({
      name: t.name,
      confidence: t.confidence,
    })),
    status: selectedBatch.status,
    createdAt: selectedBatch.createdAt,
    ...(selectedBatch.url && { url: selectedBatch.url }),
  } : null;

  return (
    <>
      <div className="rounded-lg border overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Batch Name</th>
              <th>Batch ID</th>
              <th>Type</th>
              <th>Access Level</th>
              <th>Files/Pages</th>
              <th>Topics</th>
              <th>Status</th>
              <th>Last Modified</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBatches.map((batch) => (
              <tr key={batch.id}>
                <td className="font-medium">{batch.name}</td>
                <td className="font-mono text-xs text-muted-foreground">
                  {batch.id}
                </td>
                <td>
                  <div className="flex items-center gap-1.5">
                    {batch.type === "documents" ? (
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="capitalize">{batch.type}</span>
                  </div>
                </td>
                <td>{getAccessBadge(batch.accessLevel)}</td>
                <td>
                  {batch.type === "documents"
                    ? `${batch.files.length} files`
                    : `${batch.pageLimit || "–"} pages`}
                </td>
                <td>
                  {batch.status === "awaiting_approval"
                    ? "Pending approval"
                    : `${batch.topics.length} approved`}
                </td>
                <td>{getStatusBadge(batch.status)}</td>
                <td className="text-muted-foreground text-sm">
                  {new Date(batch.createdAt).toLocaleDateString()}
                </td>
                <td className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewJson(batch)}>
                        <FileJson className="h-4 w-4 mr-2" />
                        View JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleRerunExtraction(batch)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Re-run Topic Extraction
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleDelete(batch.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JSON Viewer Dialog */}
      <Dialog open={showJsonViewer} onOpenChange={setShowJsonViewer}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Batch Knowledge: {selectedBatch?.id}</DialogTitle>
            <DialogDescription>
              JSON representation of the knowledge batch data
            </DialogDescription>
          </DialogHeader>
          <pre className="p-4 rounded-lg bg-muted/50 text-sm overflow-auto max-h-[400px] scrollbar-thin">
            {JSON.stringify(batchJson, null, 2)}
          </pre>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Knowledge Batch?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove this knowledge from the assistant immediately.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Batch
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
