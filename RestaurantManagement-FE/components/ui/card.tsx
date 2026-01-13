import { ReactNode } from "react";

export function Card({ children }: { children: ReactNode }) {
  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-8 shadow-xl backdrop-blur">
      {children}
    </div>
  );
}
