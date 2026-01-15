import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepInfo {
  label: string;
  microcopy?: string;
}

interface FormProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: StepInfo[];
  completedMicrocopy?: string[];
}

const FormProgressBar = ({
  currentStep,
  totalSteps,
  steps,
  completedMicrocopy = ["Nice choice", "You're doing great", "Almost there", "Looking good", "Final stretch"],
}: FormProgressBarProps) => {
  const progress = (currentStep / totalSteps) * 100;
  const previousStep = currentStep - 1;

  return (
    <div className="mb-8">
      {/* Header with step info and percentage */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
          {currentStep <= totalSteps && steps[currentStep - 1] && (
            <motion.span
              className="text-sm font-medium text-primary"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              key={currentStep}
            >
              {steps[currentStep - 1].label}
            </motion.span>
          )}
        </div>
        <span className="text-sm font-medium text-primary">
          {Math.round(progress)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators with labels */}
      <div className="flex justify-between mt-4 relative">
        {steps.map((step, index) => {
          const stepNum = index + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;
          
          return (
            <div key={stepNum} className="flex flex-col items-center">
              {/* Step indicator */}
              <motion.div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300",
                  "border-2",
                  isCompleted && "bg-primary border-primary text-primary-foreground",
                  isActive && "border-primary bg-primary/20 text-primary",
                  !isCompleted && !isActive && "border-white/20 text-muted-foreground bg-secondary/30"
                )}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {isCompleted ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.3, type: "spring" }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="number"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {stepNum}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Step label (hidden on mobile for space) */}
              <span className={cn(
                "text-[10px] mt-1.5 hidden sm:block text-center max-w-[80px] truncate",
                isActive ? "text-primary font-medium" : "text-muted-foreground"
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Microcopy feedback when step completes */}
      <AnimatePresence>
        {previousStep > 0 && previousStep <= completedMicrocopy.length && (
          <motion.div
            className="mt-3 text-center"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            key={`microcopy-${previousStep}`}
          >
            <span className="text-xs text-primary/80 font-medium">
              {completedMicrocopy[previousStep - 1]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormProgressBar;
