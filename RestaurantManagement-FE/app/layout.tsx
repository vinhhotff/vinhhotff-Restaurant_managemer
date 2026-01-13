import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Restaurant Auth Portal",
  description: "Register and sign in to manage restaurant reservations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <div className="flex min-h-screen flex-col bg-slate-950">
          <header className="border-b border-slate-800 bg-slate-900/80">
            <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4">
              <span className="text-lg font-semibold tracking-wide text-primary">
                Restaurant Manager
              </span>
              <nav className="flex gap-4 text-sm text-slate-300">
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </nav>
            </div>
          </header>
          <main className="flex flex-1 items-center justify-center px-4 py-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
