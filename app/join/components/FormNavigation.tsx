type FormNavigationProps = {
  step: number;
  onBack: () => void;
  onNext: () => void;
  canAdvance: boolean;
};

export function FormNavigation({ step, onBack, onNext, canAdvance }: FormNavigationProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <button
        type="button"
        onClick={onBack}
        disabled={step === 1}
        className="rounded-full border border-white/10 bg-transparent px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-[#d4af37]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
      >
        Back
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={!canAdvance}
        className="rounded-full bg-[#d4af37] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b0b0b] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {step === 5 ? "Submit" : "Continue"}
      </button>
    </div>
  );
}
