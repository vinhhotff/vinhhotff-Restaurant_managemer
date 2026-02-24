import "./globals.css";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Manrope } from "next/font/google";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";
import { LayoutClient } from "@/components/layout-client";

const inter = Inter({ subsets: ["latin"] });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export const metadata: Metadata = {
  title: "RestoManager – Restaurant Management",
  description: "Manage reservations, tables, and operations",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const pathnameFromServer = headersList.get("x-pathname") ?? "";
  return (
    <html lang="en">
      <body className={`${inter.className} ${manrope.variable} min-h-screen bg-background antialiased selection:bg-primary/30 font-sans`}>
        <Providers>
          <LayoutClient initialPathname={pathnameFromServer}>{children}</LayoutClient>
        </Providers>
      </body>
    </html>
  );
}
