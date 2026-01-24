import React from 'react';

interface Step {
  title: string;
  description: string;
}

interface StepListProps {
  steps: Step[];
}

export const StepList: React.FC<StepListProps> = ({ steps }) => {
  return (
    <ol className="space-y-4 mt-6">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-luminous-gold text-white font-mono text-sm flex items-center justify-center">
            {index + 1}
          </div>
          <div>
            <p className="font-sans font-medium text-luminous-text-primary">
              {step.title}
            </p>
            <p className="text-luminous-text-secondary text-sm mt-1">
              {step.description}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
};
