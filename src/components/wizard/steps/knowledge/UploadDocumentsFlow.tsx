import { useState, useCallback } from "react";
import { Upload, X, FileIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { KnowledgeBatch, KnowledgeFile, SAMPLE_FILES, SAMPLE_TOPICS } from "./types";
import { TopicApprovalModal } from "./TopicApprovalModal";
import { BatchProcessingStatus } from "./BatchProcessingStatus";

interface UploadDocumentsFlowProps {
  onBatchCreated: (batch: KnowledgeBatch) => void;
}

type FlowState = "form" | "uploading" | "topic_approval" | "processing" | "complete";

const ACCESS_LEVELS = [
  { value: "public", label: "Public (Anonymous)" },
  { value: "employee", label: "Employee" },
  { value: "executive", label: "Executive" },
  { value: "custom", label: "Custom Role" },
];

export function UploadDocumentsFlow({ onBatchCreated }: UploadDocumentsFlowProps) {
  const [flowState, setFlowState] = useState<FlowState>("form");
  const [batchName, setBatchName] = useState("");
  const [batchDescription, setBatchDescription] = useState("");
  const [accessLevel, setAccessLevel] = useState("employee");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [files, setFiles] = useState<KnowledgeFile[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<KnowledgeBatch | null>(null);

  const generateBatchId = () => `BATCH-${Math.floor(1000 + Math.random() * 9000)}`;

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles: KnowledgeFile[] = Array.from(e.target.files).map((file, idx) => ({
        id: `file-${Date.now()}-${idx}`,
        name: file.name,
        size: file.size,
        type: file.name.split(".").pop() || "unknown",
        status: "pending" as const,
      }));
      setFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleRemoveFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const handleUseSampleData = () => {
    setBatchName("HR Policies v1");
    setBatchDescription("Core HR documentation including employee handbook, leave policies, and onboarding materials.");
    setTags(["HR", "policies", "onboarding"]);
    setFiles(SAMPLE_FILES.map(f => ({ ...f, status: "pending" as const })));
  };

  const simulateUpload = async () => {
    setFlowState("uploading");
    const totalSteps = files.length * 4; // 4 stages per file
    let currentStep = 0;

    for (let i = 0; i < files.length; i++) {
      const stages: KnowledgeFile["status"][] = ["uploading", "scraping", "extracting", "topic_generation"];
      for (const stage of stages) {
        setFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: stage } : f
        ));
        currentStep++;
        setUploadProgress((currentStep / totalSteps) * 100);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      setFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: "ready" } : f
      ));
    }

    // Create batch and move to topic approval
    const batch: KnowledgeBatch = {
      id: generateBatchId(),
      name: batchName,
      description: batchDescription,
      type: "documents",
      accessLevel: accessLevel as KnowledgeBatch["accessLevel"],
      tags,
      files: files.map(f => ({ ...f, status: "ready" })),
      topics: SAMPLE_TOPICS.map(t => ({ ...t })),
      status: "awaiting_approval",
      createdAt: new Date().toISOString(),
    };
    setCurrentBatch(batch);
    setFlowState("topic_approval");
  };

  const handleTopicsApproved = (approvedTopics: typeof SAMPLE_TOPICS) => {
    if (!currentBatch) return;
    
    const updatedBatch: KnowledgeBatch = {
      ...currentBatch,
      topics: approvedTopics,
      status: "embedding",
    };
    setCurrentBatch(updatedBatch);
    setFlowState("processing");

    // Simulate embedding process
    setTimeout(() => {
      const finalBatch: KnowledgeBatch = {
        ...updatedBatch,
        status: "ready",
        files: updatedBatch.files.map(f => ({ ...f, status: "indexed" })),
      };
      setCurrentBatch(finalBatch);
      setFlowState("complete");
    }, 2500);
  };

  const handleComplete = () => {
    if (currentBatch) {
      onBatchCreated(currentBatch);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (flowState === "topic_approval" && currentBatch) {
    return (
      <TopicApprovalModal
        batchId={currentBatch.id}
        topics={currentBatch.topics}
        onApprove={handleTopicsApproved}
        onBack={() => setFlowState("form")}
      />
    );
  }

  if (flowState === "processing" || flowState === "complete") {
    return (
      <BatchProcessingStatus
        batch={currentBatch!}
        onComplete={handleComplete}
        isComplete={flowState === "complete"}
      />
    );
  }

  if (flowState === "uploading") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Uploading & Processing Files</CardTitle>
          <CardDescription>
            Please wait while we process your documents...
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>

          <div className="space-y-3">
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
              >
                <FileIcon className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    {file.status === "ready" ? "✓ Complete" : file.status.replace("_", " ")}...
                  </p>
                </div>
                {file.status === "ready" ? (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    Done
                  </Badge>
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Upload Batch</CardTitle>
        <CardDescription>
          Each upload is stored as a Batch. Batches can be edited or removed later.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Batch Name */}
        <div className="space-y-2">
          <Label htmlFor="batch-name">
            Batch Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="batch-name"
            placeholder="e.g., HR Policies v1"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="batch-desc">Batch Description (Optional)</Label>
          <Textarea
            id="batch-desc"
            placeholder="Describe the contents of this batch..."
            rows={2}
            value={batchDescription}
            onChange={(e) => setBatchDescription(e.target.value)}
          />
        </div>

        {/* Access Level */}
        <div className="space-y-2">
          <Label>Access Level</Label>
          <Select value={accessLevel} onValueChange={setAccessLevel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ACCESS_LEVELS.map((level) => (
                <SelectItem key={level.value} value={level.value}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleRemoveTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* File Upload Area */}
        <div className="space-y-2">
          <Label>Upload Files</Label>
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-medium">
              Drag & drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Supports: doc, docx, ppt, pptx, xls, xlsx, pdf, jpg, png, txt
            </p>
            <input
              id="file-input"
              type="file"
              multiple
              accept=".doc,.docx,.ppt,.pptx,.xls,.xlsx,.pdf,.jpg,.jpeg,.png,.txt"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2"
            >
              <Label>Selected Files ({files.length})</Label>
              <div className="max-h-48 overflow-y-auto space-y-2 scrollbar-thin">
                {files.map((file) => (
                  <motion.div
                    key={file.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                  >
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm flex-1 truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleUseSampleData}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            Use Sample Data
          </Button>
          <Button
            onClick={simulateUpload}
            disabled={!batchName || files.length === 0}
            className="ml-auto"
          >
            Upload Batch
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
