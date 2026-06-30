import { motion } from "framer-motion";

type TextInputStepProps = {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
};

export function TextInputStep({ value, placeholder, onChange }: TextInputStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col justify-between"
    >
      <div className="space-y-5">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-3xl border border-white/10 bg-[#111] px-5 py-4 text-base text-white outline-none transition focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
        />
      </div>
    </motion.div>
  );
}
