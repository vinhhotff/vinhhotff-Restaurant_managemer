"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MdPayments, MdEventSeat, MdTableRestaurant, MdPersonAdd, MdMoreVert, MdDownload } from "react-icons/md";

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

export default function AdminDashboardPage() {
  const [recentReservations, setRecentReservations] = useState<ReservationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ data: ReservationItem[] }>("/api/reservations")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? [];
        setRecentReservations(Array.isArray(data) ? data.slice(0, 5) : []);
      })
      .catch(() => {
        if (!cancelled) setRecentReservations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const formatDate = (d?: string, start?: string) => {
    if (!d) return "—";
    const t = start ?? "";
    return `${d}${t ? `, ${t}` : ""}`;
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-gourmet-bg-dark font-display text-slate-900 dark:text-white">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-gourmet-bg-dark p-6 md:p-10 max-w-[1400px] w-full mx-auto flex flex-col gap-8">
        <header className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Dashboard Overview</h1>
            <p className="text-gourmet-muted text-base font-normal">Welcome back, manage your restaurant operations efficiently.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 bg-[#37342a] hover:bg-[#4a4639] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <MdDownload className="text-[20px]" />
              Export Report
            </button>
            <Link
              href="/admin/reservations/new"
              className="flex items-center gap-2 bg-gourmet-primary text-gourmet-bg-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-gourmet-primary/20"
            >
              + New Reservation
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-gourmet-surface shadow-sm border border-gourmet-border">
            <div className="flex justify-between items-start">
              <p className="text-gourmet-muted text-sm font-medium uppercase tracking-wider">Total Revenue</p>
              <MdPayments className="text-gourmet-primary text-[24px]" />
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">$24,592</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#0bda1d] text-sm font-medium">+8% vs last week</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-gourmet-surface shadow-sm border border-gourmet-border">
            <div className="flex justify-between items-start">
              <p className="text-gourmet-muted text-sm font-medium uppercase tracking-wider">Total Reservations</p>
              <MdEventSeat className="text-gourmet-primary text-[24px]" />
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">142</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#0bda1d] text-sm font-medium">+12% vs last week</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-gourmet-surface shadow-sm border border-gourmet-border">
            <div className="flex justify-between items-start">
              <p className="text-gourmet-muted text-sm font-medium uppercase tracking-wider">Active Tables</p>
              <MdTableRestaurant className="text-gourmet-primary text-[24px]" />
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">78%</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#fa4238] text-sm font-medium">-5% vs last week</span>
            </div>
          </div>
          <div className="flex flex-col gap-1 rounded-xl p-6 bg-gourmet-surface shadow-sm border border-gourmet-border">
            <div className="flex justify-between items-start">
              <p className="text-gourmet-muted text-sm font-medium uppercase tracking-wider">New Users</p>
              <MdPersonAdd className="text-gourmet-primary text-[24px]" />
            </div>
            <p className="text-slate-900 dark:text-white text-3xl font-bold leading-tight mt-2">+12</p>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-[#0bda1d] text-sm font-medium">+2% vs last week</span>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-xl border border-gourmet-border bg-gourmet-surface p-6 flex flex-col justify-between">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Reservation Trends</h3>
                <p className="text-sm text-gourmet-muted">Weekly Overview</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-gourmet-primary" />
                <span className="text-xs font-medium text-gourmet-muted">Bookings</span>
              </div>
            </div>
            <div className="relative h-64 w-full">
              <svg className="h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                <defs>
                  <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#dcb32e" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#dcb32e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <line stroke="#3e3b30" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={250} y2={250} />
                <line stroke="#3e3b30" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={175} y2={175} />
                <line stroke="#3e3b30" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={100} y2={100} />
                <line stroke="#3e3b30" strokeDasharray="4 4" strokeWidth={1} x1={0} x2={800} y1={25} y2={25} />
                <path
                  d="M0,200 C50,180 100,220 150,150 C200,80 250,120 300,100 C350,80 400,60 450,90 C500,120 550,100 600,50 C650,0 700,40 750,30 L800,20"
                  fill="none"
                  stroke="#dcb32e"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                />
                <path
                  d="M0,200 C50,180 100,220 150,150 C200,80 250,120 300,100 C350,80 400,60 450,90 C500,120 550,100 600,50 C650,0 700,40 750,30 L800,20 L800,300 L0,300 Z"
                  fill="url(#chartGradient)"
                />
                <circle cx={150} cy={150} fill="#171612" r={4} stroke="#dcb32e" strokeWidth={2} />
                <circle cx={300} cy={100} fill="#171612" r={4} stroke="#dcb32e" strokeWidth={2} />
                <circle cx={450} cy={90} fill="#171612" r={4} stroke="#dcb32e" strokeWidth={2} />
                <circle cx={600} cy={50} fill="#171612" r={4} stroke="#dcb32e" strokeWidth={2} />
              </svg>
            </div>
            <div className="flex justify-between mt-4 px-2 text-xs font-medium text-gourmet-muted">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
          </div>
          <div className="rounded-xl border border-gourmet-border bg-gourmet-surface p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Table Occupancy Status</h3>
            <div className="flex-1 flex items-center justify-center relative">
              <div
                className="w-48 h-48 rounded-full relative"
                style={{ background: "conic-gradient(#dcb32e 0% 35%, #4a4639 35% 85%, #b7b19f 85% 100%)" }}
              >
                <div className="absolute inset-4 bg-gourmet-surface rounded-full flex flex-col items-center justify-center z-10">
                  <span className="text-3xl font-bold text-slate-900 dark:text-white">85%</span>
                  <span className="text-xs text-gourmet-muted uppercase tracking-wide">Capacity</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 mt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gourmet-primary" />
                  <span className="text-sm text-gourmet-muted">Occupied</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">35%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#4a4639]" />
                  <span className="text-sm text-gourmet-muted">Available</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">50%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#b7b19f]" />
                  <span className="text-sm text-gourmet-muted">Reserved</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">15%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gourmet-border bg-gourmet-surface overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gourmet-border flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h2>
            <Link href="/admin/reservations" className="text-sm text-gourmet-primary font-semibold hover:text-yellow-400">
              View All
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#37342a]">
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Customer</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Table</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Guests</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Date & Time</th>
                  <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gourmet-border">
                {loading ? (
                  <tr><td colSpan={5} className="p-4 text-gourmet-muted">Loading…</td></tr>
                ) : recentReservations.length === 0 ? (
                  <tr><td colSpan={5} className="p-4 text-gourmet-muted">No recent reservations.</td></tr>
                ) : (
                  recentReservations.map((r) => (
                    <tr key={r.id} className="hover:bg-[#322f27] transition-colors">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">{r.userFullName ?? "—"}</td>
                      <td className="p-4 text-sm text-gourmet-muted">{r.tableName ?? "—"}</td>
                      <td className="p-4 text-sm text-gourmet-muted">{r.numberOfGuests ?? "—"} ppl</td>
                      <td className="p-4 text-sm text-gourmet-muted">{formatDate(r.reservationDate, r.startTime)}</td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/reservations/${r.id}`}
                          className="text-gourmet-muted hover:text-white inline-flex"
                        >
                          <MdMoreVert className="text-[20px]" />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
