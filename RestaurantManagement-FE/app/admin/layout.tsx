"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

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
      <div className="flex min-h-screen w-full items-center justify-center bg-gourmet-bg-dark font-display">
        <p className="text-gourmet-muted">Đang tải…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
