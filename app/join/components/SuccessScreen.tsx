import Link from "next/link";
import { motion } from "framer-motion";

export function SuccessScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-full flex-col items-center justify-center rounded-3xl border border-[#d4af37]/10 bg-[#111] p-8 text-center"
    >
      <p className="text-sm uppercase tracking-[0.35em] text-[#d4af37]/80">Ready</p>
      <h3 className="mt-4 text-3xl font-semibold text-white">You’re all set.</h3>
      <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400">
        Your story is captured locally. When the experience is ready, this entry will be part of the farewell.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-[#d4af37] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b0b0b] transition hover:brightness-95"
      >
        Return home
      </Link>
    </motion.div>
  );
}
