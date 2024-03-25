import { useState } from "react";

export default function useStep() {
  const [step, setStep] = useState<number>(0);


  function nextStep() {
    setStep((prevStep) => prevStep + 1);
  }

  function prevStep() {
    setStep((prevStep) => prevStep <= 0 ? 0 : prevStep - 1);
  }


  return {
    step,
    setStep,
    nextStep,
    prevStep,
  };


}