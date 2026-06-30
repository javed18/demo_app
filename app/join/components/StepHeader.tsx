import { motion } from "framer-motion";

type StepHeaderProps = {
  step: number;
  title: string;
  description: string;
  submitted: boolean;
};

export function StepHeader({ step, title, description, submitted }: StepHeaderProps) {
  return (
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]/75">Step {step} of 5</p>
        <h2 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">
          {submitted ? "You’re almost there." : title}
        </h2>
        <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
          {submitted ? "Review your entry and submit when ready." : description}
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[#d4af37]"
      >
        Premium
      </motion.div>
    </div>
  );
}
