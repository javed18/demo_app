"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { getSupabase } from "../../lib/supabaseClient";

type MemoryRow = {
  id: number;
  name: string | null;
  favorite_team_memory: string | null;
  influential_person_reason: string | null;
  funniest_teammate: string | null;
  message_for_javed: string | null;
};

type CounterProps = {
  value: number;
  label: string;
  suffix?: string;
};

function parseInfluence(text: string | null) {
  const value = text?.trim();
  if (!value) {
    return { name: "A thoughtful voice", reason: "A tribute is waiting to be shared." };
  }

  const separatorIndex = value.search(/[:\-–—]/);
  if (separatorIndex === -1) {
    return { name: "A thoughtful voice", reason: value };
  }

  const name = value.slice(0, separatorIndex).trim();
  const reason = value.slice(separatorIndex + 1).trim();

  return {
    name: name || "A thoughtful voice",
    reason: reason || value,
  };
}

function AnimatedCounter({ value, label, suffix = "" }: CounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let frame = 0;
    const duration = 900;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
      transition={{ duration: 0.45 }}
      className="rounded-[24px] border border-white/10 bg-white/5 p-7 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
    >
      <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">{label}</p>
      <p className="mt-4 text-4xl font-semibold text-white sm:text-5xl">
        {display}
        {suffix}
      </p>
    </motion.div>
  );
}

export default function DashboardPage() {
  const [memories, setMemories] = useState<MemoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFavoriteIndex, setActiveFavoriteIndex] = useState(0);
  const [openMessageId, setOpenMessageId] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMemories() {
      const supabase = getSupabase();

      if (!supabase) {
        if (isMounted) {
          setError("Supabase is not configured.");
          setLoading(false);
        }
        return;
      }

      const { data, error } = await supabase
        .from("memories")
        .select("id, name, favorite_team_memory, influential_person_reason, funniest_teammate, message_for_javed")
        .order("id", { ascending: false });

      if (!isMounted) {
        return;
      }

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      setMemories((data as MemoryRow[]) ?? []);
      setLoading(false);
    }

    loadMemories();

    const supabase = getSupabase();
    if (!supabase) {
      return () => {
        isMounted = false;
      };
    }

    const channel = supabase
      .channel("memories-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "memories" },
        (payload) => {
          const incoming = payload.new as MemoryRow;
          setMemories((current) => {
            const exists = current.some((item) => item.id === incoming.id);
            if (exists) {
              return current;
            }
            return [incoming, ...current];
          });
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const favoriteMemories = useMemo(
    () => memories.filter((memory) => memory.favorite_team_memory?.trim()),
    [memories]
  );

  const influentialPeople = useMemo(
    () => memories.filter((memory) => memory.influential_person_reason?.trim()),
    [memories]
  );

  const funniestTeammates = useMemo(() => {
    const counts = new Map<string, number>();

    memories.forEach((memory) => {
      const values = (memory.funniest_teammate || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      values.forEach((name) => {
        counts.set(name, (counts.get(name) || 0) + 1);
      });
    });

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
  }, [memories]);

  const messagesForJaved = useMemo(
    () => memories.filter((memory) => memory.message_for_javed?.trim()),
    [memories]
  );

  useEffect(() => {
    setActiveFavoriteIndex(0);
  }, [favoriteMemories.length]);

  const currentFavorite = favoriteMemories[activeFavoriteIndex];
  const featuredInfluence = influentialPeople.slice(0, 3);
  const maxFunnyCount = funniestTeammates[0]?.count || 1;

  const nextFavorite = () => {
    setActiveFavoriteIndex((current) => (current + 1) % favoriteMemories.length);
  };

  const previousFavorite = () => {
    setActiveFavoriteIndex((current) => (current - 1 + favoriteMemories.length) % favoriteMemories.length);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-screen items-center justify-center rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl"
        >
          Loading the story...
        </motion.div>
      );
    }

    if (error) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-screen items-center justify-center rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl"
        >
          {error}
        </motion.div>
      );
    }

    if (memories.length === 0) {
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex min-h-screen items-center justify-center rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl"
        >
          No contributions have been shared yet.
        </motion.div>
      );
    }

    return (
      <>
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3">
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Live Dashboard</p>
                <span className="flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#d4af37]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4af37] shadow-[0_0_10px_rgba(212,175,55,0.9)]" />
                  Live
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-semibold text-white sm:text-6xl">The Story of Our Team</h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400 sm:text-xl">
                Every memory, every laugh, every lesson—captured before the next chapter begins.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-zinc-500">Now unfolding</p>
              <p className="text-2xl font-semibold text-white">{memories.length} contributions shared</p>
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-[#d4af37] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#0b0b0b] transition hover:brightness-95"
              >
                Return home
              </Link>
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8 max-w-2xl">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Statistics</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">A quiet measure of the moments that mattered.</h2>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              <AnimatedCounter value={memories.length} label="Contributions" />
              <AnimatedCounter value={favoriteMemories.length} label="Favorite memories" />
              <AnimatedCounter value={influentialPeople.length} label="Influential voices" />
              <AnimatedCounter value={messagesForJaved.length} label="Letters for Javed" />
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Favorite Team Memories</p>
                <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">The moments that still glow.</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={previousFavorite}
                  disabled={favoriteMemories.length <= 1}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.2em] text-zinc-300 transition hover:border-[#d4af37]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextFavorite}
                  disabled={favoriteMemories.length <= 1}
                  className="rounded-full border border-[#d4af37]/30 bg-[#d4af37]/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-[#d4af37] transition hover:bg-[#d4af37]/20 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {favoriteMemories.length === 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl">
                No favorite memories have been shared yet.
              </div>
            ) : (
              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#0f0f0f]/70 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {currentFavorite && (
                    <motion.article
                      key={currentFavorite.id}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -24 }}
                      transition={{ duration: 0.35 }}
                      className="w-full"
                    >
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[#d4af37]/80">{currentFavorite.name || "A teammate"}</p>
                      <p className="mt-5 text-2xl leading-10 text-zinc-100 sm:text-3xl">
                        "{currentFavorite.favorite_team_memory}"
                      </p>
                    </motion.article>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Most Influential People</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Voices that left a lasting mark.</h2>
            </div>

            {featuredInfluence.length === 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl">
                No reflections have been shared yet.
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="flex flex-col justify-end gap-4 lg:flex-row lg:items-end lg:gap-4">
                  {featuredInfluence.map((memory, index) => {
                    const influence = parseInfluence(memory.influential_person_reason);
                    const heights = ["h-40", "h-56", "h-44"];
                    return (
                      <motion.article
                        key={memory.id}
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: false, amount: 0.2 }}
                        transition={{ duration: 0.35, delay: index * 0.08 }}
                        className={`rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl ${heights[index]}`}
                      >
                        <p className="text-[11px] uppercase tracking-[0.32em] text-[#d4af37]/80">{index === 1 ? "Top tribute" : "Reflection"}</p>
                        <h3 className="mt-3 text-xl font-semibold text-white">{influence.name}</h3>
                        <p className="mt-4 text-sm leading-7 text-zinc-300">{influence.reason}</p>
                      </motion.article>
                    );
                  })}
                </div>
                <div className="space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
                  {influentialPeople.map((memory, index) => {
                    const influence = parseInfluence(memory.influential_person_reason);
                    return (
                      <div key={memory.id} className="rounded-2xl border border-white/10 bg-[#111] px-4 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-white">{influence.name}</p>
                          <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-500">#{index + 1}</p>
                        </div>
                        <p className="mt-2 text-sm leading-7 text-zinc-400">{influence.reason}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Funniest Teammates</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">The ones who kept the room bright.</h2>
            </div>

            {funniestTeammates.length === 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl">
                No laugh-out-loud shoutouts yet.
              </div>
            ) : (
              <div className="grid gap-4 lg:grid-cols-2">
                {funniestTeammates.map((entry, index) => {
                  const width = Math.max((entry.count / maxFunnyCount) * 100, 10);
                  return (
                    <motion.div
                      key={entry.name}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.06 }}
                      className="rounded-[24px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[11px] uppercase tracking-[0.32em] text-[#d4af37]/80">#{index + 1}</p>
                          <h3 className="mt-2 text-xl font-semibold text-white">{entry.name}</h3>
                        </div>
                        <p className="text-sm text-zinc-500">{entry.count} mention{entry.count > 1 ? "s" : ""}</p>
                      </div>
                      <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${width}%` }}
                          viewport={{ once: false, amount: 0.2 }}
                          transition={{ duration: 0.5, delay: 0.1 }}
                          className="h-full rounded-full bg-gradient-to-r from-[#d4af37] to-[#f6e4af]"
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.55 }}
          className="flex min-h-screen items-center px-6 py-16 sm:px-8 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-[0.35em] text-[#d4af37]/80">Messages for Javed</p>
              <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">Letters kept close, opened with care.</h2>
            </div>

            {messagesForJaved.length === 0 ? (
              <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 text-center text-zinc-400 backdrop-blur-xl">
                No letters for Javed have been shared yet.
              </div>
            ) : (
              <div className="grid gap-5 lg:grid-cols-2">
                {messagesForJaved.map((memory, index) => {
                  const isOpen = openMessageId === memory.id;
                  return (
                    <motion.article
                      key={memory.id}
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.2 }}
                      transition={{ duration: 0.35, delay: index * 0.05 }}
                      className="overflow-hidden rounded-[24px] border border-white/10 bg-[#101010]/80 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenMessageId(isOpen ? null : memory.id)}
                        className="flex w-full flex-col items-start gap-4 p-6 text-left"
                      >
                        <div className="flex items-center justify-between gap-4 self-stretch">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.32em] text-[#d4af37]/80">{memory.name || "A teammate"}</p>
                            <p className="mt-2 text-lg font-semibold text-white">A handwritten note</p>
                          </div>
                          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-zinc-300">
                            {isOpen ? "Close" : "Open"}
                          </span>
                        </div>
                        <p className="text-sm leading-7 text-zinc-400">
                          {memory.message_for_javed?.slice(0, 120)}{memory.message_for_javed && memory.message_for_javed.length > 120 ? "…" : ""}
                        </p>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-white/10 px-6 pb-6 pt-4">
                              <p
                                className="text-xl leading-9 text-zinc-200"
                                style={{ fontFamily: "'Segoe Script', 'Brush Script MT', cursive" }}
                              >
                                {memory.message_for_javed}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.article>
                  );
                })}
              </div>
            )}
          </div>
        </motion.section>
      </>
    );
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b0b0b] text-white">
      <motion.div
        animate={{ y: [0, -20, 0], opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(212,175,55,0.18),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_30%)]"
      />
      <main className="relative z-10">{renderContent()}</main>
    </div>
  );
}
