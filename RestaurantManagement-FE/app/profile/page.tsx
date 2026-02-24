"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { MdPerson, MdCalendarToday, MdRestaurantMenu, MdShoppingCart } from "react-icons/md";
import { ThemeToggle } from "@/components/theme-toggle";

type UserReservation = {
  id: number;
  reservationCode?: string;
  reservationDate?: string;
  startTime?: string;
  endTime?: string;
  numberOfGuests?: number;
  tableName?: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [loadingRes, setLoadingRes] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoadingRes(false);
      return;
    }
    let cancelled = false;
    api
      .get<{ data: UserReservation[] } | UserReservation[]>(`/api/users/${user.id}/reservations`)
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : (res.data as { data?: UserReservation[] })?.data ?? [];
        setReservations(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setReservations([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingRes(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login?redirect=/profile" as import("next").Route);
    }
  }, [authLoading, user, router]);

  if (authLoading) {
    return (
      <div className="font-display bg-[#f8f7f6] dark:bg-[#201b12] min-h-screen flex items-center justify-center">
        <p className="text-[#6C6A66] dark:text-gourmet-muted">Đang tải…</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="font-display bg-[#f8f7f6] dark:bg-[#201b12] min-h-screen flex flex-col transition-colors duration-200">
      {/* Navbar - giống menu */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] dark:border-[#37322a] bg-[#f8f7f6]/95 dark:bg-[#201b12]/95 backdrop-blur-sm px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <Link href="/menu" className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-full bg-gourmet-primary/10 text-gourmet-primary">
              <MdRestaurantMenu className="text-[24px]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#171512] dark:text-white">
              Gourmet Haven
            </h1>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href={"/cart" as import("next").Route}
              className="p-2 text-[#171512] dark:text-white hover:text-gourmet-primary transition-colors"
            >
              <MdShoppingCart className="text-[24px]" />
            </Link>
            <div className="h-9 w-9 rounded-full bg-gourmet-primary/20 border border-[#e5e5e5] dark:border-[#37322a] flex items-center justify-center text-gourmet-primary font-bold text-sm">
              {user.fullName?.charAt(0) ?? "U"}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#171512] dark:text-white tracking-tight mb-2">
              Tài khoản của tôi
            </h2>
            <p className="text-[#6C6A66] dark:text-gourmet-muted text-lg">
              Thông tin cá nhân và lịch sử đặt bàn.
            </p>
          </div>

          {/* Card: Thông tin cá nhân */}
          <section className="rounded-xl overflow-hidden shadow-sm border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E]">
            <div className="p-6 border-b border-[#e5e5e5] dark:border-[#37322a] flex items-center gap-2">
              <MdPerson className="text-gourmet-primary text-[24px]" />
              <h3 className="text-lg font-bold text-[#171512] dark:text-white">Thông tin cá nhân</h3>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gourmet-primary/20 border-2 border-gourmet-primary/30 flex items-center justify-center text-3xl font-bold text-gourmet-primary">
                {(user.fullName ?? user.email ?? "?").charAt(0)}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[#171512] dark:text-white font-semibold text-lg">{user.fullName ?? "—"}</p>
                <p className="text-[#6C6A66] dark:text-gourmet-muted text-sm">{user.email ?? "—"}</p>
                {user.phone && (
                  <p className="text-[#6C6A66] dark:text-gourmet-muted text-sm">{user.phone}</p>
                )}
                {user.role && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gourmet-primary/20 text-gourmet-primary w-fit">
                    {user.role}
                  </span>
                )}
              </div>
            </div>
          </section>

          {/* Card: Lịch sử đặt bàn */}
          <section className="rounded-xl overflow-hidden shadow-sm border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E]">
            <div className="p-6 border-b border-[#e5e5e5] dark:border-[#37322a] flex items-center gap-2">
              <MdCalendarToday className="text-gourmet-primary text-[24px]" />
              <h3 className="text-lg font-bold text-[#171512] dark:text-white">Lịch sử đặt bàn</h3>
            </div>
            <div className="overflow-x-auto">
              {loadingRes ? (
                <div className="p-6 text-[#6C6A66] dark:text-gourmet-muted text-sm">Đang tải…</div>
              ) : reservations.length === 0 ? (
                <div className="p-6 text-[#6C6A66] dark:text-gourmet-muted text-sm">Chưa có đặt bàn nào.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f8f7f6] dark:bg-[#37322a] border-b border-[#e5e5e5] dark:border-[#37322a]">
                      <th className="px-4 py-3 text-[#6C6A66] dark:text-gourmet-muted text-xs font-semibold uppercase">Mã</th>
                      <th className="px-4 py-3 text-[#6C6A66] dark:text-gourmet-muted text-xs font-semibold uppercase">Ngày</th>
                      <th className="px-4 py-3 text-[#6C6A66] dark:text-gourmet-muted text-xs font-semibold uppercase">Giờ</th>
                      <th className="px-4 py-3 text-[#6C6A66] dark:text-gourmet-muted text-xs font-semibold uppercase">Số khách</th>
                      <th className="px-4 py-3 text-[#6C6A66] dark:text-gourmet-muted text-xs font-semibold uppercase">Bàn</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5e5] dark:divide-[#37322a]">
                    {reservations.map((r) => (
                      <tr key={r.id} className="hover:bg-[#f8f7f6] dark:hover:bg-[#37322a]/50 transition-colors">
                        <td className="px-4 py-3 font-mono text-sm text-[#171512] dark:text-white">{r.reservationCode ?? r.id}</td>
                        <td className="px-4 py-3 text-sm text-[#6C6A66] dark:text-gourmet-muted">{r.reservationDate ?? "—"}</td>
                        <td className="px-4 py-3 text-sm text-[#6C6A66] dark:text-gourmet-muted">{r.startTime ?? "—"} – {r.endTime ?? "—"}</td>
                        <td className="px-4 py-3 text-sm text-[#6C6A66] dark:text-gourmet-muted">{r.numberOfGuests ?? "—"}</td>
                        <td className="px-4 py-3 text-sm text-[#6C6A66] dark:text-gourmet-muted">{r.tableName ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gourmet-primary text-white font-semibold hover:bg-gourmet-primary/90 transition-colors shadow-lg shadow-gourmet-primary/20"
            >
              <MdRestaurantMenu className="text-[20px]" />
              Xem thực đơn
            </Link>
            <Link
              href="/cart"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white dark:bg-[#2A251E] text-[#171512] dark:text-white font-semibold border border-[#e5e5e5] dark:border-[#37322a] hover:bg-[#f0f0f0] dark:hover:bg-[#37322a] transition-colors"
            >
              <MdShoppingCart className="text-[20px]" />
              Giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
