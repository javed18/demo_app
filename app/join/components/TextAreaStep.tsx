import { motion } from "framer-motion";

type TextAreaStepProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export function TextAreaStep({ value, placeholder, onChange }: TextAreaStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col justify-between"
    >
      <div className="space-y-5">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={6}
          placeholder={placeholder}
          className="h-40 w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-base text-white outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
        />
      </div>
    </motion.div>
  );
}
