import React from 'react';
import { OrderingDomainModel } from '@taotask/modules/order/core/model/ordering.domain-model';

interface ProgressBarProps {
  step: OrderingDomainModel.OrderingStep;
}

const STEP_LABELS: Record<OrderingDomainModel.OrderingStep, string> = {
  [OrderingDomainModel.OrderingStep.RESTAURANT]: 'Choix du restaurant',
  [OrderingDomainModel.OrderingStep.MEALS_PREVIEW]: 'Aperçu des plats',
  [OrderingDomainModel.OrderingStep.TABLE]: 'Choix de la table',
  [OrderingDomainModel.OrderingStep.GUESTS]: 'Vos invités',
  [OrderingDomainModel.OrderingStep.MEALS]: 'Commandes',
  [OrderingDomainModel.OrderingStep.SUMMARY]: 'Résumé',
  [OrderingDomainModel.OrderingStep.RESERVED]: 'Confirmé',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ step }) => {
  // RESERVED step is excluded from progress (confirmation only)
  const totalSteps = 6;
  const currentStep = step >= OrderingDomainModel.OrderingStep.RESERVED ? totalSteps : step + 1;
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div
        className="h-1 bg-luxury-bg-secondary rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={0}
        aria-valuemax={totalSteps}
        aria-label={`Étape ${currentStep} sur ${totalSteps}`}
      >
        <div
          className="h-full bg-gradient-to-r from-luxury-gold to-luxury-gold-muted transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-center text-sm text-luxury-text-secondary mt-2">
        Étape {currentStep}/{totalSteps} : {STEP_LABELS[step]}
      </p>
    </div>
  );
};
