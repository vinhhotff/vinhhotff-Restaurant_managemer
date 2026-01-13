import { ReactNode, forwardRef, HTMLAttributes } from "react";
import classNames from "classnames";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={classNames("w-full rounded-xl border border-border/50 bg-card/50 shadow-sm backdrop-blur-xl transition-all", className)}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={classNames("flex flex-col space-y-1.5 p-6", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return <h3 className={classNames("font-semibold leading-none tracking-tight", className)}>{children}</h3>;
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={classNames("p-6 pt-0", className)}>{children}</div>;
}
