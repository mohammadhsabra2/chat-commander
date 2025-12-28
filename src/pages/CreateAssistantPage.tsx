import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTenant } from "@/contexts/TenantContext";
import { toast } from "sonner";
import { WizardStepper } from "@/components/wizard/WizardStepper";
import { WizardNavigation } from "@/components/wizard/WizardNavigation";
import { BasicsStep, BasicsFormData } from "@/components/wizard/steps/BasicsStep";
import { KnowledgeStep } from "@/components/wizard/steps/KnowledgeStep";
import { ReviewStep } from "@/components/wizard/steps/ReviewStep";
import { KnowledgeBatch } from "@/components/wizard/steps/knowledge/types";

const WIZARD_STEPS = [
  { id: 1, label: "Basics" },
  { id: 2, label: "Knowledge" },
  { id: 3, label: "Review & Create" },
];

export default function CreateAssistantPage() {
  const navigate = useNavigate();
  const { selectedTenant } = useTenant();
  const [step, setStep] = useState(1);

  const [basicsData, setBasicsData] = useState<BasicsFormData>({
    name: "",
    description: "",
    instructions: "",
    tenantId: selectedTenant !== "all" ? selectedTenant : "",
    model: "gpt-4o",
    temperature: 0.3,
    contextWindow: "5",
    responseLength: "medium",
  });

  const [knowledgeBatches, setKnowledgeBatches] = useState<KnowledgeBatch[]>([]);

  const handleBasicsChange = (data: Partial<BasicsFormData>) => {
    setBasicsData((prev) => ({ ...prev, ...data }));
  };

  const canProceedStep1 = basicsData.name && basicsData.tenantId && basicsData.model && basicsData.instructions;
  const canProceedStep2 = true; // Knowledge is optional
  const canProceedStep3 = true;

  const canGoNext = step === 1 ? !!canProceedStep1 : step === 2 ? canProceedStep2 : canProceedStep3;

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleCreate();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleCancel = () => {
    navigate("/assistants");
  };

  const handleSaveDraft = () => {
    toast.success("AI Assistant saved as draft");
    navigate("/assistants");
  };

  const handleCreate = () => {
    toast.success("AI Assistant created successfully!");
    navigate("/assistants/a1"); // Navigate to assistant detail page
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-6xl mx-auto"
    >
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/assistants">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="page-title">Create AI Assistant</h1>
          <p className="text-muted-foreground">
            Configure assistant identity and model settings before adding knowledge.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <WizardStepper steps={WIZARD_STEPS} currentStep={step} />

      {/* Step Content */}
      <div className="min-h-[500px]">
        {step === 1 && (
          <BasicsStep
            data={basicsData}
            onChange={handleBasicsChange}
            globalTenant={selectedTenant}
          />
        )}

        {step === 2 && (
          <KnowledgeStep
            batches={knowledgeBatches}
            onBatchesChange={setKnowledgeBatches}
          />
        )}

        {step === 3 && (
          <ReviewStep basicsData={basicsData} batches={knowledgeBatches} />
        )}
      </div>

      {/* Navigation */}
      <WizardNavigation
        currentStep={step}
        totalSteps={3}
        canGoNext={canGoNext}
        onBack={handleBack}
        onNext={handleNext}
        onSaveDraft={handleSaveDraft}
        onCancel={handleCancel}
        isLastStep={step === 3}
        createButtonLabel="Create Assistant"
      />
    </motion.div>
  );
}
