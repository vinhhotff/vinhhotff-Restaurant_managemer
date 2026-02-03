"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Header } from "@/components/header";

const AUTH_PATHS = ["/register", "/login"];

export function LayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = AUTH_PATHS.some((p) => pathname === p);

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen flex-col relative overflow-hidden">
      <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed top-1/2 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none z-0" />
      <Header />
      <main className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
