type ProgressIndicatorProps = {
  progress: number;
};

export function ProgressIndicator({ progress }: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-xs uppercase tracking-[0.32em] text-zinc-500">Progress</span>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10 sm:max-w-[220px]">
        <div className="h-full rounded-full bg-[#d4af37]" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}
