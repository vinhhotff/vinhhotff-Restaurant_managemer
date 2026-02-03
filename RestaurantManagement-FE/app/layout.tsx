import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { Header } from "@/components/header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RestoManager – Restaurant Management",
  description: "Manage reservations, tables, and operations",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-background antialiased selection:bg-primary/30`}>
        <Providers>
          <div className="flex min-h-screen flex-col relative overflow-hidden">
            <div className="fixed -top-24 -left-24 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none z-0" />
            <div className="fixed top-1/2 -right-24 w-64 h-64 bg-secondary/20 rounded-full blur-3xl pointer-events-none z-0" />
            <Header />
            <main className="flex-1 flex flex-col relative z-10 w-full max-w-7xl mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
