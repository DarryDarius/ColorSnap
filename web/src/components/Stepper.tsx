export type StepperStep = {
  label: string;
  description?: string;
};

export function Stepper({
  steps,
  currentStep,
}: {
  steps: StepperStep[];
  currentStep: number; // 0-based
}) {
  return (
    <div className="stepper" role="list" aria-label="Progress">
      {steps.map((step, idx) => {
        const status =
          idx < currentStep ? "done" : idx === currentStep ? "active" : "todo";
        return (
          <div
            key={step.label}
            className={`stepper__step stepper__step--${status}`}
            role="listitem"
          >
            <div className="stepper__dot" aria-hidden="true" />
            <div className="stepper__text">
              <div className="stepper__label">{step.label}</div>
              {step.description ? (
                <div className="stepper__desc">{step.description}</div>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}


