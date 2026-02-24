"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { MdPerson, MdCalendarToday, MdArrowBack } from "react-icons/md";

type UserProfile = {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
};

type UserReservation = {
  id: number;
  reservationCode?: string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  tableName?: string;
};

export default function UserProfilePage() {
  const params = useParams();
  const id = Number(params?.id);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    Promise.all([
      api.get<{ data: UserProfile } | UserProfile>(`/api/users/${id}`),
      api.get<{ data: UserReservation[] } | UserReservation[]>(`/api/users/${id}/reservations`).catch(() => ({ data: [] })),
    ])
      .then(([userRes, resRes]) => {
        if (cancelled) return;
        const userData = (userRes.data as { data?: UserProfile })?.data ?? (userRes.data as UserProfile);
        setUser(userData ?? null);
        const resData = Array.isArray(resRes.data) ? resRes.data : (resRes.data as { data?: UserReservation[] })?.data ?? [];
        setReservations(Array.isArray(resData) ? resData : []);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
        setReservations([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gourmet-bg-dark font-display text-slate-900 dark:text-white p-8">
        <p className="text-gourmet-muted">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gourmet-bg-dark font-display text-slate-900 dark:text-white p-8">
        <p className="text-gourmet-muted">User not found.</p>
        <Link href="/admin/users" className="text-gourmet-primary hover:underline mt-2 inline-block">Back to User Directory</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gourmet-bg-dark font-display text-slate-900 dark:text-white">
      <div className="max-w-[1000px] mx-auto px-4 md:px-10 py-8 flex flex-col gap-6">
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <Link href="/admin" className="text-gourmet-muted font-medium hover:text-gourmet-primary transition-colors">Dashboard</Link>
          <span className="text-gourmet-muted">›</span>
          <Link href="/admin/users" className="text-gourmet-muted font-medium hover:text-gourmet-primary transition-colors">User Directory</Link>
          <span className="text-gourmet-muted">›</span>
          <span className="text-white font-medium">Profile</span>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/admin/users"
            className="flex items-center gap-2 text-gourmet-muted hover:text-white transition-colors"
          >
            <MdArrowBack className="text-[20px]" />
            Back
          </Link>
        </div>

        <section className="rounded-xl border border-gourmet-border bg-gourmet-surface overflow-hidden">
          <div className="p-6 border-b border-gourmet-border flex items-center gap-2">
            <MdPerson className="text-gourmet-primary text-[24px]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">User Profile & History</h2>
          </div>
          <div className="p-6 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gourmet-primary/20 border-2 border-gourmet-primary/30 flex items-center justify-center text-3xl font-bold text-gourmet-primary">
                {(user.fullName ?? "?").charAt(0)}
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.fullName ?? "—"}</h1>
                <p className="text-gourmet-muted text-sm">{user.email ?? "—"}</p>
                <p className="text-gourmet-muted text-sm">{user.phone ?? "—"}</p>
                {user.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gourmet-primary/20 text-gourmet-primary w-fit">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-gourmet-border bg-gourmet-surface overflow-hidden">
          <div className="p-6 border-b border-gourmet-border flex items-center gap-2">
            <MdCalendarToday className="text-gourmet-primary text-[24px]" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Reservation History</h2>
          </div>
          <div className="overflow-x-auto">
            {reservations.length === 0 ? (
              <div className="p-6 text-gourmet-muted text-sm">No reservations yet.</div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#37342a] border-b border-gourmet-border">
                    <th className="px-4 py-3 text-gourmet-muted text-xs font-semibold uppercase">Code</th>
                    <th className="px-4 py-3 text-gourmet-muted text-xs font-semibold uppercase">Date</th>
                    <th className="px-4 py-3 text-gourmet-muted text-xs font-semibold uppercase">Time</th>
                    <th className="px-4 py-3 text-gourmet-muted text-xs font-semibold uppercase">Guests</th>
                    <th className="px-4 py-3 text-gourmet-muted text-xs font-semibold uppercase">Table</th>
                    <th className="px-4 py-3 text-gourmet-muted text-xs font-semibold uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gourmet-border">
                  {reservations.map((r) => (
                    <tr key={r.id} className="hover:bg-[#322f27] transition-colors">
                      <td className="px-4 py-3 font-mono text-sm">{r.reservationCode ?? r.id}</td>
                      <td className="px-4 py-3 text-sm text-gourmet-muted">{r.reservationDate ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gourmet-muted">{r.startTime ?? "—"} – {r.endTime ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gourmet-muted">{r.numberOfGuests ?? "—"}</td>
                      <td className="px-4 py-3 text-sm text-gourmet-muted">{r.tableName ?? "—"}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/admin/reservations/${r.id}`} className="text-gourmet-primary hover:underline text-sm font-medium">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
