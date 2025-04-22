import React from "react";
import { IonProgressBar } from "@ionic/react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  // Calculate the progress percentage based on current and total steps
  const progress = (currentStep / totalSteps) * 100;

  return (
    <IonProgressBar value={progress / 100} type="indeterminate" color="primary" />
  );
};

export default ProgressBar;
