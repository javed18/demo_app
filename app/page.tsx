"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const particles = Array.from({ length: 18 }, (_, index) => ({
  id: index,
  size: 8 + (index % 5) * 4,
  left: `${(index * 7) % 100}%`,
  top: `${(index * 13) % 100}%`,
  duration: 10 + (index % 5) * 3,
  delay: index * 0.4,
}));

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.18),_transparent_45%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_35%)]" />
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute rounded-full bg-[#d4af37]/80 blur-[1px]"
            style={{
              width: particle.size,
              height: particle.size,
              left: particle.left,
              top: particle.top,
              boxShadow: "0 0 24px rgba(212, 175, 55, 0.35)",
            }}
            animate={{
              y: [0, -24, 0],
              x: [0, 10, 0],
              opacity: [0.2, 0.9, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-6 py-16 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-8 rounded-full border border-[#d4af37]/35 bg-[#d4af37]/10 px-4 py-2 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#d4af37] backdrop-blur"
          >
            Farewell 
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.7 }}
            className="text-5xl font-semibold tracking-[0.2em] text-white sm:text-6xl lg:text-7xl"
          >
            The Last Model
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-6 max-w-3xl text-xl leading-9 text-zinc-300 sm:text-2xl"
          >
            The final model I built at Marsh wasn&apos;t about AI.
            <br className="hidden sm:block" />
            It was about people.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-8 max-w-2xl text-base leading-8 text-zinc-400 sm:text-lg"
          >
            Over the past two years I&apos;ve worked with incredibly talented people.
            Before I leave, I&apos;d love to build one last thing together.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href="/join"
              className="rounded-full bg-[#d4af37] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.24em] text-[#0b0b0b] shadow-[0_0_40px_rgba(212,175,55,0.22)] transition-transform duration-300 hover:-translate-y-0.5"
            >
              Join Experience
            </Link>
            <Link
              href="/dashboard"
              className="rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.24em] text-white/90 backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 hover:border-[#d4af37]/40 hover:text-[#d4af37]"
            >
              Live Dashboard
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-10 text-sm uppercase tracking-[0.35em] text-zinc-500"
          >
            Scan the QR Code
          </motion.p>
        </motion.div>
      </main>
    </div>
  );
}
