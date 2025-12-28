import { ArrowLeft, ArrowRight, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  canGoNext: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveDraft: () => void;
  onCancel: () => void;
  isLastStep?: boolean;
  createButtonLabel?: string;
}

export function WizardNavigation({
  currentStep,
  totalSteps,
  canGoNext,
  onBack,
  onNext,
  onSaveDraft,
  onCancel,
  isLastStep = false,
  createButtonLabel = "Create Assistant",
}: WizardNavigationProps) {
  return (
    <div className="flex items-center justify-between pt-6 border-t border-border mt-6">
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel}>
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
      
      <div className="flex gap-2">
        {currentStep > 1 && (
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        )}
        
        <Button variant="secondary" onClick={onSaveDraft}>
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        
        <Button onClick={onNext} disabled={!canGoNext}>
          {isLastStep ? (
            createButtonLabel
          ) : (
            <>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
