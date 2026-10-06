import type { ReactNode } from "react";

export function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100 sm:text-2xl">{title}</h2>
        {hint && <p className="mt-1.5 text-sm text-zinc-400">{hint}</p>}
      </div>
      {children}
    </section>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-xl backdrop-blur-md transition-all ${className}`}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/50 bg-zinc-800/40 p-4 text-center">
      <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
      <p className="mt-1 text-xs font-medium text-zinc-400">{label}</p>
    </div>
  );
}
