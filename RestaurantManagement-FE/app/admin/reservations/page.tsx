"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  MdDashboard,
  MdCalendarToday,
  MdRestaurantMenu,
  MdGroup,
  MdPerson,
  MdSettings,
  MdAdd,
} from "react-icons/md";

type ReservationItem = {
  id: number;
  reservationCode?: string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  tableName?: string;
  userFullName?: string;
};

export default function AdminReservationsPage() {
  const [list, setList] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-[#f8f7f6] dark:bg-[#201d12] font-display text-slate-900 dark:text-white">
      <aside className="flex h-screen w-64 flex-col justify-between border-r border-[#3e3b30] bg-[#171612] p-4 flex-shrink-0 sticky top-0">
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3 px-2">
            <div className="size-10 rounded-full border border-[#3e3b30] bg-gourmet-primary/10 flex items-center justify-center">
              <span className="text-gourmet-primary font-bold">G</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-white text-base font-bold leading-normal">GourmetAdmin</h1>
              <p className="text-gourmet-muted text-xs font-normal leading-normal">Manager Dashboard</p>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors">
              <MdDashboard className="text-[20px]" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link href="/admin/reservations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gourmet-primary/20 text-gourmet-primary">
              <MdCalendarToday className="text-[20px]" />
              <span className="text-sm font-semibold">Reservations</span>
            </Link>
            <Link href="/admin/menu" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors">
              <MdRestaurantMenu className="text-[20px]" />
              <span className="text-sm font-medium">Menu</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors">
              <MdGroup className="text-[20px]" />
              <span className="text-sm font-medium">Staff</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors">
              <MdPerson className="text-[20px]" />
              <span className="text-sm font-medium">Customers</span>
            </Link>
            <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors">
              <MdSettings className="text-[20px]" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </nav>
        </div>
        <Link href="/" className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#37342a] text-white hover:bg-[#4a4639] transition-colors text-sm font-bold">
          <span className="truncate">Logout</span>
        </Link>
      </aside>
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-10 max-w-[1000px] w-full mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black leading-tight">Reservations</h1>
          <Link
            href="/admin/reservations/new"
            className="flex items-center gap-2 bg-gourmet-primary hover:bg-yellow-400 text-gourmet-bg-dark px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-gourmet-primary/20 transition-all"
          >
            <MdAdd className="text-[20px]" />
            New Reservation
          </Link>
        </div>
        {loading ? (
          <p className="text-gourmet-muted">Loading…</p>
        ) : list.length === 0 ? (
          <p className="text-gourmet-muted">No reservations yet.</p>
        ) : (
          <div className="rounded-xl border border-[#3e3b30] bg-white dark:bg-[#2c2921] overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#3e3b30] text-gourmet-muted">
                  <th className="px-4 py-3 font-medium">Code</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Table</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3e3b30]">
                {list.map((r) => (
                  <tr key={r.id} className="text-slate-900 dark:text-white">
                    <td className="px-4 py-3 font-mono">{r.reservationCode ?? r.id}</td>
                    <td className="px-4 py-3">{r.reservationDate ?? "—"}</td>
                    <td className="px-4 py-3">{r.startTime ?? "—"} – {r.endTime ?? "—"}</td>
                    <td className="px-4 py-3">{r.userFullName ?? "—"} ({r.numberOfGuests ?? "—"} guests)</td>
                    <td className="px-4 py-3">{r.tableName ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
