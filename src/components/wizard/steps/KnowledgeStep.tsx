import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddKnowledgeTab } from "./knowledge/AddKnowledgeTab";
import { KnowledgeBatchesTab } from "./knowledge/KnowledgeBatchesTab";
import { KnowledgeBatch } from "./knowledge/types";

interface KnowledgeStepProps {
  batches: KnowledgeBatch[];
  onBatchesChange: (batches: KnowledgeBatch[]) => void;
}

export function KnowledgeStep({ batches, onBatchesChange }: KnowledgeStepProps) {
  const [activeTab, setActiveTab] = useState("add");

  const handleAddBatch = (batch: KnowledgeBatch) => {
    onBatchesChange([...batches, batch]);
    setActiveTab("library");
  };

  const handleUpdateBatch = (updatedBatch: KnowledgeBatch) => {
    onBatchesChange(
      batches.map((b) => (b.id === updatedBatch.id ? updatedBatch : b))
    );
  };

  const handleDeleteBatch = (batchId: string) => {
    onBatchesChange(batches.filter((b) => b.id !== batchId));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Knowledge Management</h2>
        <p className="text-sm text-muted-foreground">
          Add documents or websites to train your assistant with relevant knowledge.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="add">Add Knowledge</TabsTrigger>
          <TabsTrigger value="library">
            Knowledge Batches {batches.length > 0 && `(${batches.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add" className="mt-6">
          <AddKnowledgeTab onBatchCreated={handleAddBatch} />
        </TabsContent>

        <TabsContent value="library" className="mt-6">
          <KnowledgeBatchesTab
            batches={batches}
            onUpdateBatch={handleUpdateBatch}
            onDeleteBatch={handleDeleteBatch}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
