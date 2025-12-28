import { useState } from "react";
import { Globe, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { KnowledgeBatch } from "./types";
import { TopicApprovalModal } from "./TopicApprovalModal";
import { BatchProcessingStatus } from "./BatchProcessingStatus";

interface WebsiteCrawlFlowProps {
  onBatchCreated: (batch: KnowledgeBatch) => void;
}

type FlowState = "form" | "crawling" | "topic_approval" | "processing" | "complete";

const ACCESS_LEVELS = [
  { value: "public", label: "Public (Anonymous)" },
  { value: "employee", label: "Employee" },
  { value: "executive", label: "Executive" },
];

const PAGE_LIMITS = [
  { value: "10", label: "10 pages" },
  { value: "50", label: "50 pages" },
  { value: "200", label: "200 pages" },
];

const SAMPLE_WEB_TOPICS = [
  { id: "wt1", name: "Getting Started Guide", confidence: 0.94, sourceFiles: ["acme.com/help/start"], snippetPreview: "Welcome to Acme! Here's how to get started with our platform...", selected: true },
  { id: "wt2", name: "Troubleshooting Common Issues", confidence: 0.91, sourceFiles: ["acme.com/help/troubleshoot"], snippetPreview: "Having issues? Here are the most common problems and solutions...", selected: true },
  { id: "wt3", name: "Account Settings", confidence: 0.89, sourceFiles: ["acme.com/help/account"], snippetPreview: "Manage your account settings, preferences, and security options...", selected: true },
  { id: "wt4", name: "Billing & Payments", confidence: 0.87, sourceFiles: ["acme.com/help/billing"], snippetPreview: "View your billing history, update payment methods, and manage subscriptions...", selected: true },
  { id: "wt5", name: "Navigation Menu", confidence: 0.25, sourceFiles: ["multiple pages"], snippetPreview: "Home | Products | Support | Contact | About Us | Login", selected: false },
  { id: "wt6", name: "Footer Links", confidence: 0.18, sourceFiles: ["multiple pages"], snippetPreview: "© 2024 Acme Inc. | Privacy Policy | Terms of Service | Cookie Settings", selected: false },
];

export function WebsiteCrawlFlow({ onBatchCreated }: WebsiteCrawlFlowProps) {
  const [flowState, setFlowState] = useState<FlowState>("form");
  const [url, setUrl] = useState("");
  const [crawlSubpages, setCrawlSubpages] = useState(true);
  const [pageLimit, setPageLimit] = useState("50");
  const [accessLevel, setAccessLevel] = useState("public");
  const [tags, setTags] = useState<string[]>(["help", "support"]);
  const [tagInput, setTagInput] = useState("");
  const [crawlProgress, setCrawlProgress] = useState(0);
  const [pagesFound, setPagesFound] = useState(0);
  const [currentBatch, setCurrentBatch] = useState<KnowledgeBatch | null>(null);

  const generateBatchId = () => `WEB-${Math.floor(100 + Math.random() * 900)}`;

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(prev => prev.filter(t => t !== tag));
  };

  const simulateCrawl = async () => {
    setFlowState("crawling");
    const totalPages = parseInt(pageLimit);
    
    for (let i = 0; i <= totalPages; i += 5) {
      setCrawlProgress((i / totalPages) * 100);
      setPagesFound(Math.min(i, 23)); // Simulating 23 pages found
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Create batch
    const batch: KnowledgeBatch = {
      id: generateBatchId(),
      name: `Website: ${new URL(url).hostname}`,
      description: `Crawled from ${url}`,
      type: "website",
      accessLevel: accessLevel as KnowledgeBatch["accessLevel"],
      tags,
      files: [],
      topics: SAMPLE_WEB_TOPICS.map(t => ({ ...t })),
      status: "awaiting_approval",
      createdAt: new Date().toISOString(),
      url,
      crawlSubpages,
      pageLimit: parseInt(pageLimit),
    };
    setCurrentBatch(batch);
    setFlowState("topic_approval");
  };

  const handleTopicsApproved = (approvedTopics: typeof SAMPLE_WEB_TOPICS) => {
    if (!currentBatch) return;

    const updatedBatch: KnowledgeBatch = {
      ...currentBatch,
      topics: approvedTopics,
      status: "embedding",
    };
    setCurrentBatch(updatedBatch);
    setFlowState("processing");

    setTimeout(() => {
      const finalBatch: KnowledgeBatch = {
        ...updatedBatch,
        status: "ready",
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

  if (flowState === "crawling") {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            Crawling Website
          </CardTitle>
          <CardDescription>
            Discovering and indexing pages from {url}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Crawl Progress</span>
              <span>{Math.round(crawlProgress)}%</span>
            </div>
            <Progress value={crawlProgress} className="h-2" />
          </div>

          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <Globe className="h-12 w-12 mx-auto text-primary mb-3 animate-pulse" />
            <p className="text-2xl font-bold">{pagesFound}</p>
            <p className="text-sm text-muted-foreground">Pages found</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isValidUrl = url.match(/^https?:\/\/.+\..+/);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Public Website</CardTitle>
        <CardDescription>
          Crawl and index content from a public website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <Label htmlFor="url">
            Website URL <span className="text-destructive">*</span>
          </Label>
          <Input
            id="url"
            type="url"
            placeholder="https://example.com/help"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          {url && !isValidUrl && (
            <p className="text-xs text-destructive">Please enter a valid URL</p>
          )}
        </div>

        {/* Crawl Settings */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div>
            <Label htmlFor="crawl-subpages">Crawl sub-pages</Label>
            <p className="text-xs text-muted-foreground">
              Automatically discover and index linked pages
            </p>
          </div>
          <Switch
            id="crawl-subpages"
            checked={crawlSubpages}
            onCheckedChange={setCrawlSubpages}
          />
        </div>

        {crawlSubpages && (
          <div className="space-y-2">
            <Label>Page Limit</Label>
            <Select value={pageLimit} onValueChange={setPageLimit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_LIMITS.map((limit) => (
                  <SelectItem key={limit.value} value={limit.value}>
                    {limit.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddTag())
              }
            />
            <Button type="button" variant="secondary" onClick={handleAddTag}>
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 cursor-pointer hover:bg-destructive/20"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag} ×
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={simulateCrawl}
            disabled={!isValidUrl}
            className="ml-auto"
          >
            <Globe className="h-4 w-4 mr-2" />
            Start Crawl
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
