import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
  description?: string;
}

interface WizardStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function WizardStepper({ steps, currentStep, className }: WizardStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step circle and label */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all duration-300",
                  currentStep > step.id
                    ? "bg-primary border-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary border-primary text-primary-foreground shadow-glow"
                    : "border-muted-foreground/30 text-muted-foreground bg-background"
                )}
              >
                {currentStep > step.id ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={cn(
                  "mt-2 text-sm font-medium whitespace-nowrap",
                  currentStep >= step.id ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {step.label}
              </span>
              {step.description && (
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {step.description}
                </span>
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4 h-0.5 relative">
                <div className="absolute inset-0 bg-muted-foreground/20 rounded-full" />
                <div 
                  className={cn(
                    "absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500",
                    currentStep > step.id ? "w-full" : "w-0"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
