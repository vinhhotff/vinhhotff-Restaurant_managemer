"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { UserResponse } from "@/lib/types/user";
import {
  MdDashboard,
  MdCalendarToday,
  MdRestaurantMenu,
  MdGroup,
  MdPerson,
  MdSettings,
  MdArrowBack,
  MdArrowForward,
  MdCheck,
  MdCalendarMonth,
  MdTableRestaurant,
  MdAttachMoney,
  MdPerson as MdPersonIcon,
  MdCall,
  MdMail,
  MdCake,
  MdExpandMore,
} from "react-icons/md";

const DEFAULT_RESTAURANT_ID = 1;
const OCCASIONS = [
  { value: "", label: "Select an occasion (optional)" },
  { value: "birthday", label: "Birthday" },
  { value: "anniversary", label: "Anniversary" },
  { value: "business", label: "Business Meal" },
  { value: "date", label: "Date Night" },
  { value: "other", label: "Other" },
] as const;

type TableItem = {
  id: number;
  tableName?: string | null;
  tableNumber?: string | null;
  capacity?: number;
};

function getTomorrowDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

export default function AdminNewReservationPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingTables, setLoadingTables] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reservationDate, setReservationDate] = useState(getTomorrowDate);
  const [startTime, setStartTime] = useState("19:00");
  const [endTime, setEndTime] = useState("20:00");
  const [numberOfGuests, setNumberOfGuests] = useState(4);
  const [tableId, setTableId] = useState<number | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [occasion, setOccasion] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoadingUsers(true);
    api
      .get<{ data: { content: UserResponse[] } }>("/api/users?size=100&sort=fullName,asc")
      .then((res) => {
        if (cancelled) return;
        const content = res.data?.data?.content ?? [];
        setUsers(Array.isArray(content) ? content : []);
        if (Array.isArray(content) && content.length > 0) {
          setUserId((prev) => (prev === null ? content[0].id : prev));
        }
      })
      .catch(() => {
        if (!cancelled) setUsers([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingUsers(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingTables(true);
    api
      .get<{ data: TableItem[] }>("/api/tables")
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.data ?? [];
        setTables(Array.isArray(list) ? list : []);
        if (Array.isArray(list) && list.length > 0) {
          setTableId((prev) => (prev === null ? list[0].id : prev));
        }
      })
      .catch(() => {
        if (!cancelled) setTables([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingTables(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const selectedUser = users.find((u) => u.id === userId);
  const selectedTable = tables.find((t) => t.id === tableId);
  const tableDisplayName = selectedTable
    ? selectedTable.tableName || selectedTable.tableNumber || `Table ${selectedTable.id}`
    : "—";

  const formatDateDisplay = (dateStr: string) => {
    try {
      const d = new Date(dateStr + "T00:00:00");
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!userId || !tableId) {
      setError("Please select a customer and a table.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/api/reservations", {
        userId,
        restaurantId: DEFAULT_RESTAURANT_ID,
        tableId,
        reservationDate,
        startTime,
        endTime,
        numberOfGuests,
        specialRequests: specialRequests.trim() || undefined,
        occasion: occasion || undefined,
      });
      router.push(("/admin/reservations" as import("next").Route));
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "response" in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : "Failed to create reservation.";
      setError(typeof msg === "string" ? msg : "Failed to create reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-[#f8f7f6] dark:bg-[#201d12] font-display text-slate-900 dark:text-white">
      {/* Sidebar */}
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
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors"
            >
              <MdDashboard className="text-[20px]" />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              href="/admin/reservations/new"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gourmet-primary/20 text-gourmet-primary"
            >
              <MdCalendarToday className="text-[20px]" />
              <span className="text-sm font-semibold">Reservations</span>
            </Link>
            <Link
              href="/admin/menu"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors"
            >
              <MdRestaurantMenu className="text-[20px]" />
              <span className="text-sm font-medium">Menu</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors"
            >
              <MdGroup className="text-[20px]" />
              <span className="text-sm font-medium">Staff</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors"
            >
              <MdPerson className="text-[20px]" />
              <span className="text-sm font-medium">Customers</span>
            </Link>
            <Link
              href="#"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors"
            >
              <MdSettings className="text-[20px]" />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </nav>
        </div>
        <Link
          href="/"
          className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-[#37342a] text-white hover:bg-[#4a4639] transition-colors text-sm font-bold tracking-[0.015em]"
        >
          <span className="truncate">Logout</span>
        </Link>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[#f8f7f6] dark:bg-[#201d12] text-slate-900 dark:text-white">
        <div className="p-6 md:p-10 max-w-[1000px] w-full mx-auto flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-gourmet-muted text-sm">
              <MdArrowBack className="text-[18px]" />
              <Link
                href={"/admin/reservations" as import("next").Route}
                className="hover:text-gourmet-primary transition-colors"
                style={{ color: "#b7b19f" }}
              >
                Back to Reservations
              </Link>
            </div>
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
              Book a Table
            </h1>
            <p className="text-gourmet-muted text-base font-normal">
              Create a new dining reservation.
            </p>
          </header>

          {/* Stepper */}
          <div className="flex items-center justify-between relative mb-8">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#37342a] -z-10 rounded-full" />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2/3 h-1 bg-gourmet-primary -z-10 rounded-full" />
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gourmet-primary flex items-center justify-center text-gourmet-bg-dark font-bold border-4 border-[#201d12]">
                <MdCheck className="text-lg" />
              </div>
              <span className="text-sm font-medium text-gourmet-primary">Schedule</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gourmet-primary flex items-center justify-center text-gourmet-bg-dark font-bold border-4 border-[#201d12]">
                <MdCheck className="text-lg" />
              </div>
              <span className="text-sm font-medium text-gourmet-primary">Table</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gourmet-primary text-gourmet-bg-dark flex items-center justify-center font-bold border-4 border-[#201d12] shadow-[0_0_15px_rgba(220,179,46,0.5)]">
                3
              </div>
              <span className="text-sm font-bold text-white">Guest Info</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#37342a] text-gourmet-muted flex items-center justify-center font-bold border-4 border-[#201d12]">
                4
              </div>
              <span className="text-sm font-medium text-gourmet-muted">Confirmation</span>
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white dark:bg-[#2c2921] rounded-xl border border-gray-200 dark:border-[#3e3b30] p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white border-b border-[#3e3b30] pb-4">
              Guest Information
            </h2>
            <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2 md:col-span-2">
                  <label className="text-sm font-medium text-gourmet-muted uppercase tracking-wide">
                    Customer
                  </label>
                  <div className="relative">
                    <MdPersonIcon className="absolute left-3 top-3 text-[#6b7280] text-[20px]" />
                    <select
                      value={userId ?? ""}
                      onChange={(e) => setUserId(e.target.value ? Number(e.target.value) : null)}
                      className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] rounded-lg py-2.5 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary appearance-none transition-all"
                      required
                    >
                      <option value="">Select customer</option>
                      {users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.fullName} ({u.email})
                        </option>
                      ))}
                    </select>
                    <MdExpandMore className="absolute right-3 top-3 text-[#6b7280] text-[20px] pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gourmet-muted uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <MdPersonIcon className="absolute left-3 top-3 text-[#6b7280] text-[20px]" />
                    <input
                      type="text"
                      readOnly
                      value={selectedUser?.fullName ?? ""}
                      placeholder="e.g. Jonathan Doe"
                      className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gourmet-muted uppercase tracking-wide">
                    Phone Number
                  </label>
                  <div className="relative">
                    <MdCall className="absolute left-3 top-3 text-[#6b7280] text-[20px]" />
                    <input
                      type="tel"
                      readOnly
                      value={selectedUser?.phone ?? ""}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gourmet-muted uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <MdMail className="absolute left-3 top-3 text-[#6b7280] text-[20px]" />
                    <input
                      type="email"
                      readOnly
                      value={selectedUser?.email ?? ""}
                      placeholder="jonathan@example.com"
                      className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] rounded-lg py-2.5 pl-10 pr-4 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gourmet-muted uppercase tracking-wide">
                    Special Occasion
                  </label>
                  <div className="relative">
                    <MdCake className="absolute left-3 top-3 text-[#6b7280] text-[20px]" />
                    <select
                      value={occasion}
                      onChange={(e) => setOccasion(e.target.value)}
                      className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] rounded-lg py-2.5 pl-10 pr-10 text-slate-900 dark:text-white focus:outline-none focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary appearance-none transition-all"
                    >
                      {OCCASIONS.map((o) => (
                        <option key={o.value || "none"} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                    <MdExpandMore className="absolute right-3 top-3 text-[#6b7280] text-[20px] pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-medium text-gourmet-muted uppercase tracking-wide">
                  Dietary Restrictions / Special Requests
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={3}
                  placeholder="Allergies, seating preferences, etc."
                  className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] rounded-lg py-3 px-4 text-slate-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary transition-all resize-none"
                />
              </div>
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#3e3b30]">
                <Link
                  href={"/admin/reservations" as import("next").Route}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg border border-[#3e3b30] text-gourmet-muted hover:bg-[#37342a] hover:text-white transition-colors font-semibold"
                >
                  <MdArrowBack className="text-[20px]" />
                  Back
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !userId || !tableId}
                  className="flex items-center gap-2 bg-gourmet-primary hover:bg-yellow-400 text-gourmet-bg-dark px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-gourmet-primary/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Creating…" : "Continue to Confirmation"}
                  <MdArrowForward className="text-[20px]" />
                </button>
              </div>
            </form>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gourmet-muted">
            <div className="flex items-center gap-3 bg-white dark:bg-[#2c2921] p-4 rounded-lg border border-gray-200 dark:border-[#3e3b30]">
              <div className="bg-[#37342a] p-2 rounded-md">
                <MdCalendarMonth className="text-gourmet-primary text-[24px]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider">Date &amp; Time</p>
                <p className="text-slate-900 dark:text-white font-medium">
                  {formatDateDisplay(reservationDate)} at {startTime}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-[#2c2921] p-4 rounded-lg border border-gray-200 dark:border-[#3e3b30]">
              <div className="bg-[#37342a] p-2 rounded-md">
                <MdTableRestaurant className="text-gourmet-primary text-[24px]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider">Table Selection</p>
                <p className="text-slate-900 dark:text-white font-medium">
                  {loadingTables ? "Loading…" : `${tableDisplayName} - ${numberOfGuests} Guests`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-[#2c2921] p-4 rounded-lg border border-gray-200 dark:border-[#3e3b30]">
              <div className="bg-[#37342a] p-2 rounded-md">
                <MdAttachMoney className="text-gourmet-primary text-[24px]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider">Deposit Required</p>
                <p className="text-slate-900 dark:text-white font-medium">$0.00</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
