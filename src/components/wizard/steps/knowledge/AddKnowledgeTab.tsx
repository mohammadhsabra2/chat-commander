import { useState } from "react";
import { FileUp, Globe, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadDocumentsFlow } from "./UploadDocumentsFlow";
import { WebsiteCrawlFlow } from "./WebsiteCrawlFlow";
import { KnowledgeBatch } from "./types";

interface AddKnowledgeTabProps {
  onBatchCreated: (batch: KnowledgeBatch) => void;
}

type FlowType = "select" | "documents" | "website";

export function AddKnowledgeTab({ onBatchCreated }: AddKnowledgeTabProps) {
  const [flowType, setFlowType] = useState<FlowType>("select");

  const handleBack = () => setFlowType("select");

  if (flowType === "documents") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to options
        </Button>
        <UploadDocumentsFlow onBatchCreated={onBatchCreated} />
      </div>
    );
  }

  if (flowType === "website") {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={handleBack} className="mb-2">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to options
        </Button>
        <WebsiteCrawlFlow onBatchCreated={onBatchCreated} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card 
        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
        onClick={() => setFlowType("documents")}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <FileUp className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload PDF, Word, Excel, PowerPoint, and image files
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Supports: .pdf, .doc, .docx, .ppt, .pptx, .xls, .xlsx, .jpg, .png, .txt
          </p>
        </CardContent>
      </Card>

      <Card 
        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
        onClick={() => setFlowType("website")}
      >
        <CardHeader className="text-center pb-2">
          <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-primary" />
          </div>
          <CardTitle>Add Public Website</CardTitle>
          <CardDescription>
            Crawl and index content from a public website
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-sm text-muted-foreground">
            Automatically extracts content from web pages and sub-pages
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
