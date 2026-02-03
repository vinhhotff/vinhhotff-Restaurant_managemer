"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
            <span className="text-primary font-bold">R</span>
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Resto<span className="text-primary">Manager</span>
          </span>
        </Link>
      </div>
    </header>
  );
}
