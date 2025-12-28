import { useState } from "react";
import { Search, CheckCircle, Trash2, ChevronDown, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { KnowledgeTopic } from "./types";

interface TopicApprovalModalProps {
  batchId: string;
  topics: KnowledgeTopic[];
  onApprove: (topics: KnowledgeTopic[]) => void;
  onBack: () => void;
}

export function TopicApprovalModal({
  batchId,
  topics: initialTopics,
  onApprove,
  onBack,
}: TopicApprovalModalProps) {
  const [topics, setTopics] = useState(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const filteredTopics = topics.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCount = topics.filter((t) => t.selected).length;
  const unselectedCount = topics.length - selectedCount;

  const toggleTopic = (topicId: string) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === topicId ? { ...t, selected: !t.selected } : t))
    );
  };

  const toggleExpanded = (topicId: string) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) {
        next.delete(topicId);
      } else {
        next.add(topicId);
      }
      return next;
    });
  };

  const handleSelectAll = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, selected: true })));
  };

  const handleSelectNone = () => {
    setTopics((prev) => prev.map((t) => ({ ...t, selected: false })));
  };

  const handleDeleteSelected = () => {
    setTopics((prev) => prev.filter((t) => !t.selected));
    setShowDeleteConfirm(false);
  };

  const handleApprove = () => {
    const approvedTopics = topics.filter((t) => t.selected);
    onApprove(approvedTopics);
  };

  const getConfidenceBadgeClass = (confidence: number) => {
    if (confidence >= 0.8) return "bg-success/10 text-success border-success/20";
    if (confidence >= 0.5) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  return (
    <>
      <Card className="border-2 border-primary/20">
        <CardHeader className="bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Approve Topics from Batch: {batchId}</CardTitle>
              <CardDescription>
                We extracted possible topics. Remove irrelevant topics before
                embedding.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={handleSelectNone}>
                Select None
              </Button>
            </div>
          </div>

          {/* Stats Banner */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 text-sm">
            <span className="text-muted-foreground">
              {topics.length} topics detected
            </span>
            <span className="text-success font-medium">
              {selectedCount} selected
            </span>
            {unselectedCount > 0 && (
              <span className="text-muted-foreground">
                {unselectedCount} deselected
              </span>
            )}
          </div>

          {/* Topics List */}
          <div className="max-h-[400px] overflow-y-auto space-y-2 scrollbar-thin pr-2">
            <AnimatePresence>
              {filteredTopics.map((topic) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, height: 0 }}
                  className={`rounded-lg border transition-colors ${
                    topic.selected
                      ? "border-primary/30 bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <Collapsible
                    open={expandedTopics.has(topic.id)}
                    onOpenChange={() => toggleExpanded(topic.id)}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <Checkbox
                        checked={topic.selected}
                        onCheckedChange={() => toggleTopic(topic.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {topic.name}
                          </span>
                          <Badge
                            variant="outline"
                            className={getConfidenceBadgeClass(topic.confidence)}
                          >
                            {Math.round(topic.confidence * 100)}%
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {topic.sourceFiles.map((file) => (
                            <span
                              key={file}
                              className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                            >
                              {file}
                            </span>
                          ))}
                        </div>
                      </div>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ChevronDown
                            className={`h-4 w-4 transition-transform ${
                              expandedTopics.has(topic.id) ? "rotate-180" : ""
                            }`}
                          />
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-0">
                        <div className="p-3 rounded bg-muted/50 text-xs text-muted-foreground font-mono whitespace-pre-wrap">
                          {topic.snippetPreview}
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onBack}>
              Back to upload
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={selectedCount === 0}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedCount})
            </Button>
            <Button onClick={handleApprove} className="ml-auto gap-2">
              <CheckCircle className="h-4 w-4" />
              Approve Selected Topics ({selectedCount})
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Delete Topics Permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Delete {selectedCount} topics permanently from this batch? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteSelected}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Topics
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
