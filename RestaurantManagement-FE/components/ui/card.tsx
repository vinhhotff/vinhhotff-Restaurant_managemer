import { ReactNode } from "react";
import classNames from "classnames";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={classNames("w-full max-w-md rounded-xl border border-border/50 bg-card/50 p-8 shadow-2xl backdrop-blur-xl transition-all hover:bg-card/60 hover:shadow-primary/5", className)}>
      {children}
    </div>
  );
}
