"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MdTableRestaurant, MdEdit, MdAdd } from "react-icons/md";

type TableItem = {
  id: number;
  name?: string;
  capacity?: number;
  status?: string;
  area?: string;
};

export default function AdminTableLayoutPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<TableItem[] | { data: TableItem[] }>("/api/tables")
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : (res.data as { data?: TableItem[] })?.data ?? [];
        setTables(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setTables([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-gourmet-bg-dark font-display text-slate-900 dark:text-white">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-gourmet-bg-dark p-6 md:p-10 max-w-[1400px] w-full mx-auto flex flex-col gap-8">
        <header className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Table Layout</h1>
            <p className="text-gourmet-muted text-base font-normal">Visualize and manage your restaurant floor plan in real-time.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 bg-[#37342a] hover:bg-[#4a4639] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <MdEdit className="text-[20px]" />
              Edit Layout
            </button>
            <Link
              href="/admin/tables"
              className="flex items-center gap-2 bg-gourmet-primary text-gourmet-bg-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-gourmet-primary/20"
            >
              <MdAdd className="text-[20px]" />
              + Add Table
            </Link>
          </div>
        </header>

        <section className="rounded-xl border border-gourmet-border bg-gourmet-surface p-6 min-h-[400px]">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <MdTableRestaurant className="text-gourmet-primary" />
            Floor Plan
          </h2>
          {loading ? (
            <p className="text-gourmet-muted">Loading…</p>
          ) : tables.length === 0 ? (
            <p className="text-gourmet-muted">No tables. Add tables in <Link href="/admin/tables" className="text-gourmet-primary hover:underline">Table Inventory</Link>.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {tables.map((t) => (
                <div
                  key={t.id}
                  className="aspect-square rounded-xl border-2 border-gourmet-border bg-[#201d12] flex flex-col items-center justify-center gap-1 p-2 hover:border-gourmet-primary/50 transition-colors cursor-pointer"
                >
                  <span className="text-gourmet-primary font-bold text-lg">{t.name ?? `T-${t.id}`}</span>
                  <span className="text-gourmet-muted text-xs">{t.capacity ?? "—"} seats</span>
                  {t.status && (
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      t.status.toLowerCase() === "available" ? "bg-green-900/30 text-green-400" :
                      t.status.toLowerCase() === "occupied" ? "bg-gourmet-primary/20 text-gourmet-primary" : "bg-gourmet-muted/20 text-gourmet-muted"
                    }`}>
                      {t.status}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
