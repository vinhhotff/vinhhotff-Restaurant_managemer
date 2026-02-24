"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { MdPerson, MdTableRestaurant, MdPayments, MdEdit, MdPrint, MdCheckCircle, MdSchedule, MdReceiptLong } from "react-icons/md";

type ReservationDetail = {
  id: number;
  reservationCode?: string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  tableName?: string;
  userFullName?: string;
  specialRequests?: string;
  userId?: number;
};

export default function AdminReservationDetailPage() {
  const params = useParams();
  const id = Number(params?.id);
  const [reservation, setReservation] = useState<ReservationDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    api
      .get<{ data: ReservationDetail }>(`/api/reservations/${id}`)
      .then((res) => {
        if (cancelled) return;
        setReservation(res.data?.data ?? null);
      })
      .catch(() => {
        if (!cancelled) setReservation(null);
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
      <div className="max-w-[1400px] w-full mx-auto">
        <p className="text-gourmet-muted">Loading…</p>
      </div>
    );
  }

  if (!reservation) {
    return (
      <div className="max-w-[1400px] w-full mx-auto">
        <p className="text-gourmet-muted">Reservation not found.</p>
        <Link href="/admin/reservations" className="text-gourmet-primary hover:underline mt-2">Back to Reservations</Link>
      </div>
    );
  }

  const code = reservation.reservationCode ?? `R-${reservation.id}`;

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-gourmet-muted text-sm mb-1">
              <Link href="/admin/reservations" className="hover:text-gourmet-primary transition-colors">Reservations</Link>
              <span>›</span>
              <span>Details</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Reservation #{code}</h1>
            <p className="text-gourmet-muted text-base font-normal">Manage reservation details and payment status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 bg-[#e5e5e5] dark:bg-[#37342a] hover:bg-[#d0d0d0] dark:hover:bg-[#4a4639] text-[#171512] dark:text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-[#e5e5e5] dark:border-[#37322a]">
              <MdEdit className="text-[20px]" />
              Edit Details
            </button>
            <button type="button" className="bg-gourmet-primary text-gourmet-bg-dark px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-gourmet-primary/20 flex items-center gap-2">
              <MdPrint className="text-[20px]" />
              Print Receipt
            </button>
          </div>
        </header>

        <div className="rounded-xl p-6 bg-white dark:bg-[#2A251E] shadow-sm border border-[#e5e5e5] dark:border-[#37322a] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-[#0bda1d]/10 text-[#0bda1d]">
              <MdCheckCircle className="text-[28px]" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm text-gourmet-muted font-medium uppercase tracking-wider">Status</span>
              <span className="text-xl font-bold text-[#0bda1d]">Confirmed</span>
            </div>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-gourmet-border" />
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-gourmet-primary/10 text-gourmet-primary">
              <MdSchedule className="text-[28px]" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm text-gourmet-muted font-medium uppercase tracking-wider">Time Slot</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white">{reservation.startTime ?? "—"} – {reservation.endTime ?? "—"}</span>
            </div>
          </div>
          <div className="h-px w-full md:w-px md:h-12 bg-gourmet-border" />
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-500/10 text-blue-500">
              <MdReceiptLong className="text-[28px]" />
            </span>
            <div className="flex flex-col">
              <span className="text-sm text-gourmet-muted font-medium uppercase tracking-wider">Code</span>
              <span className="text-xl font-bold text-slate-900 dark:text-white font-mono tracking-widest">{code}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#e5e5e5] dark:border-[#37322a] flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MdPerson className="text-gourmet-primary" />
                Customer Information
              </h2>
              {reservation.userId != null && (
                <Link href={`/users/${reservation.userId}`} className="text-gourmet-primary hover:text-yellow-400 text-sm font-semibold">View Profile</Link>
              )}
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gourmet-primary/20 border-2 border-gourmet-primary/20 flex items-center justify-center text-2xl font-bold text-gourmet-primary">
                  {(reservation.userFullName ?? "?").charAt(0)}
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{reservation.userFullName ?? "—"}</h3>
                  <p className="text-gourmet-muted text-sm">Guest • {reservation.numberOfGuests ?? "—"} people</p>
                </div>
              </div>
              {reservation.specialRequests && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Special Requests</h4>
                  <div className="p-4 rounded-lg bg-gourmet-primary/5 border border-gourmet-primary/20 text-slate-900 dark:text-slate-200 text-sm leading-relaxed">
                    {reservation.specialRequests}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#e5e5e5] dark:border-[#37322a] flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MdTableRestaurant className="text-gourmet-primary" />
                Table Details
              </h2>
              <button type="button" className="text-gourmet-primary hover:text-yellow-400 text-sm font-semibold">Change Table</button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-[#f0f0f0] dark:bg-[#201d12] border border-[#e5e5e5] dark:border-[#37322a] flex flex-col items-center justify-center text-center gap-1">
                  <span className="text-xs text-gourmet-muted uppercase">Location</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">—</span>
                </div>
                <div className="p-4 rounded-lg bg-[#f0f0f0] dark:bg-[#201d12] border border-[#e5e5e5] dark:border-[#37322a] flex flex-col items-center justify-center text-center gap-1">
                  <span className="text-xs text-gourmet-muted uppercase">Table No.</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{reservation.tableName ?? "—"}</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center py-2 border-b border-[#e5e5e5] dark:border-[#37322a]">
                  <span className="text-gourmet-muted">Guest Count</span>
                  <span className="font-bold text-slate-900 dark:text-white">{reservation.numberOfGuests ?? "—"} Adults</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#e5e5e5] dark:border-[#37322a]">
                  <span className="text-gourmet-muted">Reservation Date</span>
                  <span className="font-bold text-slate-900 dark:text-white">{reservation.reservationDate ?? "—"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gourmet-muted">Time Slot</span>
                  <span className="font-bold text-slate-900 dark:text-white">{reservation.startTime ?? "—"} – {reservation.endTime ?? "—"}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] overflow-hidden">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-[#37322a] flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MdPayments className="text-gourmet-primary" />
              Billing Summary
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0bda1d]/10 text-[#0bda1d] border border-[#0bda1d]/20">PAID</span>
          </div>
          <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 flex flex-col gap-4">
              <p className="text-sm text-gourmet-muted">Order items will appear here when billing API is available.</p>
            </div>
            <div className="flex flex-col gap-4 bg-[#f0f0f0] dark:bg-[#201d12] p-6 rounded-lg border border-[#e5e5e5] dark:border-[#37322a]">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gourmet-muted">Subtotal</span>
                <span className="font-medium text-slate-900 dark:text-white">—</span>
              </div>
              <div className="h-px bg-gourmet-border my-2" />
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-black text-gourmet-primary">—</span>
              </div>
            </div>
          </div>
        </section>
    </div>
  );
}
