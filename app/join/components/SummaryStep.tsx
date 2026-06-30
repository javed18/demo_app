import { motion } from "framer-motion";

type SummaryStepProps = {
  form: {
    name: string;
    description: string;
    memory: string;
    advice: string;
    anonymous: boolean;
  };
  onToggleAnonymous: () => void;
};

export function SummaryStep({ form, onToggleAnonymous }: SummaryStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col justify-between"
    >
      <div className="space-y-6">
        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#111] p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Name</p>
              <p className="mt-2 text-base text-zinc-100">{form.name || "—"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">One word</p>
              <p className="mt-2 text-base text-zinc-100">{form.description || "—"}</p>
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Favorite memory</p>
            <p className="mt-2 text-base text-zinc-100">{form.memory || "—"}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-zinc-500">Advice</p>
            <p className="mt-2 text-base text-zinc-100">{form.advice || "—"}</p>
          </div>
        </div>
        <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-sm text-zinc-200 transition hover:border-[#d4af37]/40">
          <span>
            Submit anonymously
            <span className="ml-2 block text-xs text-zinc-500">Keep your contribution private on the dashboard.</span>
          </span>
          <input
            type="checkbox"
            checked={form.anonymous}
            onChange={onToggleAnonymous}
            className="h-5 w-5 rounded border border-white/10 bg-[#0b0b0b] text-[#d4af37] accent-[#d4af37]"
          />
        </label>
      </div>
    </motion.div>
  );
}
