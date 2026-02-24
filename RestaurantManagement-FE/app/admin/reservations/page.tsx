"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MdAdd, MdSearch, MdDownload, MdFilterList, MdCalendarMonth } from "react-icons/md";

type ReservationItem = {
  id: number;
  reservationCode?: string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  tableName?: string;
  userFullName?: string;
  status?: string;
};

type TabId = "all" | "pending" | "confirmed" | "completed" | "cancelled";

export default function AdminReservationsPage() {
  const [list, setList] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabId>("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ data: ReservationItem[] }>("/api/reservations")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? [];
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let items = list;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      items = items.filter(
        (r) =>
          (r.userFullName ?? "").toLowerCase().includes(q) ||
          (r.reservationCode ?? String(r.id)).toLowerCase().includes(q) ||
          (r.tableName ?? "").toLowerCase().includes(q)
      );
    }
    if (tab !== "all") {
      items = items.filter((r) => (r.status ?? "PENDING").toLowerCase() === tab);
    }
    return items;
  }, [list, search, tab]);

  const pendingCount = useMemo(() => list.filter((r) => (r.status ?? "PENDING").toLowerCase() === "pending").length, [list]);

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-gourmet-bg-dark font-display text-slate-900 dark:text-white">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-10 max-w-[1400px] w-full mx-auto">
        <header className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Reservations Ledger</h1>
            <p className="text-gourmet-muted text-base font-normal">Manage bookings, check-ins, and cancellations.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 bg-[#37342a] hover:bg-[#4a4639] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <MdDownload className="text-[20px]" />
              Export Data
            </button>
            <Link
              href="/admin/reservations/new"
              className="flex items-center gap-2 bg-gourmet-primary text-gourmet-bg-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-gourmet-primary/20"
            >
              <MdAdd className="text-[20px]" />
              New Reservation
            </Link>
          </div>
        </header>
        <div className="border-b border-gourmet-border mb-6">
          <nav aria-label="Tabs" className="-mb-px flex space-x-6">
            {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors ${
                  tab === t
                    ? "border-gourmet-primary text-gourmet-primary"
                    : "border-transparent text-gourmet-muted hover:border-gray-300 hover:text-white"
                }`}
              >
                {t === "all" ? "All Reservations" : t.charAt(0).toUpperCase() + t.slice(1)}
                {t === "pending" && pendingCount > 0 && (
                  <span className="ml-2 rounded-full bg-gourmet-primary/20 px-2.5 py-0.5 text-xs font-medium text-gourmet-primary">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <section className="rounded-xl border border-gourmet-border bg-gourmet-surface overflow-hidden flex flex-col shadow-sm">
          <div className="p-4 border-b border-gourmet-border flex gap-4 items-center bg-[#201d12]/50">
            <div className="relative flex-1 max-w-sm">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gourmet-muted text-[20px]" />
              <input
                type="text"
                placeholder="Search by name, code or table..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gourmet-border rounded-lg bg-gourmet-bg-dark text-slate-900 dark:text-white placeholder-gourmet-muted focus:outline-none focus:ring-1 focus:ring-gourmet-primary sm:text-sm"
              />
            </div>
            <button type="button" className="p-2 text-gourmet-muted hover:text-white border border-gourmet-border rounded-lg bg-gourmet-bg-dark" title="Filter">
              <MdFilterList className="text-[20px]" />
            </button>
            <button type="button" className="p-2 text-gourmet-muted hover:text-white border border-gourmet-border rounded-lg bg-gourmet-bg-dark" title="Calendar">
              <MdCalendarMonth className="text-[20px]" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#37342a]">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Code</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Customer Name</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Table</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Date</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Time (Start–End)</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Guests</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Status</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gourmet-border">
                {loading ? (
                  <tr><td colSpan={8} className="p-4 text-gourmet-muted">Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={8} className="p-4 text-gourmet-muted">No reservations match.</td></tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-[#322f27] transition-colors group">
                      <td className="p-4 font-mono text-xs font-medium text-gourmet-muted">#{r.reservationCode ?? r.id}</td>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{r.userFullName ?? "—"}</td>
                      <td className="p-4 text-sm text-gourmet-muted">{r.tableName ?? "—"}</td>
                      <td className="p-4 text-sm text-gourmet-muted">{r.reservationDate ?? "—"}</td>
                      <td className="p-4 text-sm text-gourmet-muted">{r.startTime ?? "—"} – {r.endTime ?? "—"}</td>
                      <td className="p-4 text-sm text-gourmet-muted">{r.numberOfGuests ?? "—"} ppl</td>
                      <td className="p-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gourmet-primary/10 text-gourmet-primary border border-gourmet-primary/20">
                          {(r.status ?? "PENDING")}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/admin/reservations/${r.id}`} className="text-gourmet-muted hover:text-gourmet-primary text-sm font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gourmet-border flex items-center justify-between bg-[#201d12]/50">
            <p className="text-sm text-gourmet-muted">
              Showing <span className="font-medium text-white">1</span> to <span className="font-medium text-white">{filtered.length}</span> of <span className="font-medium text-white">{filtered.length}</span> results
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
