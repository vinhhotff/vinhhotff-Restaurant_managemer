import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Restaurant Auth Portal",
  description: "Register and sign in to manage restaurant reservations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/30`}>
        <div className="flex min-h-screen flex-col relative overflow-hidden">
             {/* Decorative background blobs */}
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="fixed top-1/2 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none z-0" />

          <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4">
              <div className="flex items-center gap-2">
                 <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/20">
                    <span className="text-primary font-bold">R</span>
                 </div>
                 <span className="text-lg font-semibold tracking-tight text-foreground">
                    Resto<span className="text-primary">Manager</span>
                 </span>
              </div>
              
              <nav className="flex gap-6 text-sm font-medium text-muted-foreground">
                <a href="/login" className="hover:text-primary transition-colors">Login</a>
                <a href="/register" className="hover:text-primary transition-colors">Register</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
