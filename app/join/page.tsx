"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { getSupabase } from "../../lib/supabaseClient";
import { FormNavigation } from "./components/FormNavigation";
import { ProgressIndicator } from "./components/ProgressIndicator";
import { StepHeader } from "./components/StepHeader";
import { SuccessScreen } from "./components/SuccessScreen";
import { TextAreaStep } from "./components/TextAreaStep";
import { TextInputStep } from "./components/TextInputStep";

type JoinForm = {
  name: string;
  favoriteTeamMemory: string;
  influentialPersonReason: string;
  funniestTeammate: string;
  messageForJaved: string;
};

type FieldKey = keyof JoinForm;

const steps: Array<{
  title: string;
  description: string;
  key: FieldKey;
  placeholder: string;
  type: "text" | "textarea";
}> = [
  {
    title: "What's your name?",
    description: "Required.",
    key: "name",
    placeholder: "Ari",
    type: "text",
  },
  {
    title: "What's your favorite team memory?",
    description: "Share a cherished moment.",
    key: "favoriteTeamMemory",
    placeholder: "The late-night launch and the laughter after.",
    type: "textarea",
  },
  {
    title: "Who has influenced you the most in the team, and why?",
    description: "Tell us why they mattered.",
    key: "influentialPersonReason",
    placeholder: "Jordan — they taught us how to stay calm when the pressure was high.",
    type: "textarea",
  },
  {
    title: "Who always made the team laugh?",
    description: "A quick name is enough.",
    key: "funniestTeammate",
    placeholder: "Sam",
    type: "text",
  },
  {
    title: "Leave a message for Javed.",
    description: "A few words matter.",
    key: "messageForJaved",
    placeholder: "Thank you for building something meaningful with us.",
    type: "textarea",
  },
];

export default function JoinPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<JoinForm>({
    name: "",
    favoriteTeamMemory: "",
    influentialPersonReason: "",
    funniestTeammate: "",
    messageForJaved: "",
  });

  const currentStep = steps[step - 1];
  const isCompletedStep = currentStep ? form[currentStep.key].trim().length > 0 : true;
  const canAdvance = step === 5 ? true : isCompletedStep;
  const progress = Math.round(((step - 1) / 4) * 100);

  const handleChange = (key: keyof JoinForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step < 5) {
      setStep(step + 1);
      return;
    }

    const supabase = getSupabase();

    if (!supabase) {
      console.error("Supabase client is not configured.");
      return;
    }

    const { error } = await supabase.from("memories").insert({
      name: form.name,
      favorite_team_memory: form.favoriteTeamMemory,
      influential_person_reason: form.influentialPersonReason,
      funniest_teammate: form.funniestTeammate,
      message_for_javed: form.messageForJaved,
    });

    if (error) {
      console.error("Failed to save memory:", error.message);
      return;
    }

    setSubmitted(true);
  };

  const handleBack = () => {
    if (step === 1) return;
    setStep(step - 1);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b0b0b] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.16),_transparent_40%),radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.06),_transparent_30%)]" />
      <main className="relative z-10 mx-auto flex min-h-screen flex-col justify-center px-6 py-10 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-10 flex flex-col gap-4 text-center sm:text-left">
            <p className="text-xs uppercase tracking-[0.4em] text-[#d4af37]/80">Join Experience</p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              A farewell built from the team&apos;s stories.
            </h1>
            <p className="mx-auto max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
              Share the memories, the people, and the words that should be carried forward.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_32px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-10"
          >
            <StepHeader
              step={step}
              title={currentStep?.title ?? ""}
              description={currentStep?.description ?? ""}
              submitted={submitted}
            />

            <div className="mb-8 min-h-[320px] sm:min-h-[360px]">
              <AnimatePresence mode="wait">
                {!submitted ? (
                  currentStep?.type === "textarea" ? (
                    <TextAreaStep
                      key={step}
                      value={form[currentStep.key]}
                      placeholder={currentStep.placeholder}
                      onChange={(value) => handleChange(currentStep.key, value)}
                    />
                  ) : (
                    <TextInputStep
                      key={step}
                      value={form[currentStep.key]}
                      placeholder={currentStep.placeholder}
                      onChange={(value) => handleChange(currentStep.key, value)}
                    />
                  )
                ) : (
                  <SuccessScreen key="submitted" />
                )}
              </AnimatePresence>
            </div>

            {!submitted && (
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <ProgressIndicator progress={progress} />
                  <FormNavigation
                    step={step}
                    onBack={handleBack}
                    onNext={handleNext}
                    canAdvance={canAdvance}
                  />
                </div>
              </div>
            )}
          </motion.div>

          <div className="mt-8 flex flex-col gap-3 text-center text-sm text-zinc-500 sm:text-left">
            <p className="text-zinc-500">Your contribution will appear live on the dashboard as soon as it is submitted.</p>
            <Link href="/dashboard" className="text-[#d4af37] transition hover:text-white">
              View the live dashboard
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
