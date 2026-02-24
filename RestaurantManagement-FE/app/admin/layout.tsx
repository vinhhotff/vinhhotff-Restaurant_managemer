"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, loading, checked } = useAuth();

  useEffect(() => {
    if (!loading && checked && !user) {
      router.replace("/login?redirect=/admin" as import("next").Route);
    }
  }, [loading, checked, user, router]);

  if (loading || !checked) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f8f7f6] dark:bg-[#201b12] font-display transition-colors duration-200">
        <p className="text-gourmet-muted">Đang tải…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen w-full flex-row overflow-hidden bg-[#f8f7f6] dark:bg-[#201b12] font-display text-[#171512] dark:text-white transition-colors duration-200">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-0 overflow-y-auto overflow-x-hidden bg-[#f8f7f6] dark:bg-[#201b12] p-6 md:p-10">
        {children}
      </main>
    </div>
  );
}
