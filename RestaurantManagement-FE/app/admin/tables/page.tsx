"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  MdDashboard,
  MdTableRestaurant,
  MdCalendarToday,
  MdRestaurantMenu,
  MdGroup,
  MdPerson,
  MdSettings,
  MdTune,
  MdAdd,
  MdSearch,
  MdExpandMore,
  MdEdit,
  MdDelete,
  MdChevronLeft,
  MdChevronRight,
  MdTableBar,
  MdDeck,
  MdMeetingRoom,
  MdLocalBar,
} from "react-icons/md";

type TableItem = {
  id: number;
  restaurantId?: number;
  areaId?: number;
  areaName?: string | null;
  tableNumber?: string | null;
  tableName?: string | null;
  capacity?: number | null;
  minPersons?: number | null;
  positionDescription?: string | null;
  status?: string | null;
  features?: Record<string, unknown> | null;
  createdAt?: string;
  updatedAt?: string;
};

const AREA_OPTIONS = [
  { value: "", label: "All Areas" },
  { value: "Main Dining", label: "Main Dining" },
  { value: "Terrace / Patio", label: "Terrace / Patio" },
  { value: "Bar Area", label: "Bar Area" },
  { value: "Private Room", label: "Private Room" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "available", label: "Available" },
  { value: "occupied", label: "Occupied" },
  { value: "reserved", label: "Reserved" },
  { value: "maintenance", label: "Maintenance" },
];

const PAGE_SIZE = 10;

function statusClass(status: string | null | undefined) {
  const s = (status ?? "").toLowerCase();
  if (s === "available") return "bg-[#0bda1d]/10 text-[#0bda1d] border-[#0bda1d]/20";
  if (s === "occupied") return "bg-red-500/10 text-red-500 border-red-500/20";
  if (s === "reserved") return "bg-gourmet-primary/10 text-gourmet-primary border-gourmet-primary/20";
  if (s === "maintenance") return "bg-gray-500/10 text-gray-400 border-gray-500/20";
  return "bg-[#37342a] text-gourmet-muted border-[#3e3b30]";
}

function tableIcon(areaName: string | null | undefined) {
  const a = (areaName ?? "").toLowerCase();
  if (a.includes("terrace") || a.includes("patio")) return MdDeck;
  if (a.includes("private") || a.includes("room")) return MdMeetingRoom;
  if (a.includes("bar")) return MdLocalBar;
  return MdTableBar;
}

export default function AdminTablesPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<{ data: TableItem[] }>("/api/tables")
      .then((res) => {
        if (cancelled) return;
        const list = res.data?.data ?? [];
        setTables(Array.isArray(list) ? list : []);
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

  const filtered = useMemo(() => {
    let list = tables;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          (t.tableNumber && t.tableNumber.toLowerCase().includes(q)) ||
          (t.tableName && t.tableName.toLowerCase().includes(q))
      );
    }
    if (areaFilter) {
      list = list.filter((t) => (t.areaName ?? "").toLowerCase() === areaFilter.toLowerCase());
    }
    if (statusFilter) {
      list = list.filter((t) => (t.status ?? "").toLowerCase() === statusFilter.toLowerCase());
    }
    return list;
  }, [tables, search, areaFilter, statusFilter]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(start, start + PAGE_SIZE);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this table?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/tables/${id}`);
      setTables((prev) => prev.filter((t) => t.id !== id));
    } catch {
      // keep list
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-[1400px] w-full mx-auto flex flex-col gap-8">
          <header className="flex flex-wrap justify-between items-end gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                Table Inventory Management
              </h1>
              <p className="text-gourmet-muted text-base font-normal">
                Manage your restaurant floor plan, capacities, and table configurations.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" className="flex items-center gap-2 bg-[#37342a] hover:bg-[#4a4639] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-[#3e3b30]">
                <MdTune className="text-[20px]" />
                Settings
              </button>
              <Link
                href={"/admin/tables/new" as import("next").Route}
                className="bg-gourmet-primary text-gourmet-bg-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-gourmet-primary/20 flex items-center gap-2"
              >
                <MdAdd className="text-[20px]" />
                Add New Table
              </Link>
            </div>
          </header>

          {/* Toolbar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-4 flex flex-col md:flex-row gap-4 p-4 rounded-xl bg-white dark:bg-[#2c2921] border border-gray-200 dark:border-[#3e3b30] items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gourmet-muted text-[20px]" />
                  <input
                    type="text"
                    placeholder="Search table no..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] text-sm text-slate-900 dark:text-white rounded-lg pl-10 pr-4 py-2.5 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary placeholder-gourmet-muted"
                  />
                </div>
                <div className="relative w-full md:w-48">
                  <select
                    value={areaFilter}
                    onChange={(e) => setAreaFilter(e.target.value)}
                    className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] text-sm text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary appearance-none cursor-pointer"
                  >
                    {AREA_OPTIONS.map((o) => (
                      <option key={o.value || "all"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-gourmet-muted pointer-events-none text-[20px]" />
                </div>
                <div className="relative w-full md:w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#f8f7f6] dark:bg-[#201d12] border border-gray-300 dark:border-[#3e3b30] text-sm text-slate-900 dark:text-white rounded-lg px-4 py-2.5 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary appearance-none cursor-pointer"
                  >
                    {STATUS_OPTIONS.map((o) => (
                      <option key={o.value || "all"} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <MdExpandMore className="absolute right-3 top-1/2 -translate-y-1/2 text-gourmet-muted pointer-events-none text-[20px]" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gourmet-muted">
                <span>
                  Showing <strong>{pageItems.length}</strong> of <strong>{total}</strong> tables
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <section className="rounded-xl border border-gray-200 dark:border-[#3e3b30] bg-white dark:bg-[#2c2921] overflow-hidden flex flex-col shadow-sm">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="p-8 text-center text-gourmet-muted">Loading tables…</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-[#37342a] border-b border-gray-200 dark:border-[#3e3b30]">
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Table No.</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Area Name</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Capacity</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Min. Persons</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Features</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted">Status</th>
                      <th className="p-4 text-xs font-semibold uppercase tracking-wider text-gourmet-muted text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#3e3b30]">
                    {pageItems.map((row) => {
                      const Icon = tableIcon(row.areaName);
                      const features = row.features && typeof row.features === "object"
                        ? Object.keys(row.features).map((k) => k.replace(/([A-Z])/g, " $1").trim())
                        : [];
                      const statusDisplay = (row.status ?? "available").charAt(0).toUpperCase() + (row.status ?? "").slice(1);
                      return (
                        <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-[#322f27] transition-colors group">
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Icon className="text-gourmet-muted text-[20px]" />
                              <span className="font-bold text-slate-900 dark:text-white">
                                {row.tableNumber ?? row.tableName ?? `T-${row.id}`}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-sm text-gourmet-muted">{row.areaName ?? "—"}</td>
                          <td className="p-4 text-sm text-slate-900 dark:text-white font-medium">
                            {row.capacity != null ? `${row.capacity} pax` : "—"}
                          </td>
                          <td className="p-4 text-sm text-gourmet-muted">
                            {row.minPersons != null ? `${row.minPersons} pax` : "—"}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              {features.length > 0
                                ? features.map((f) => (
                                    <span
                                      key={f}
                                      className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#37342a] text-gourmet-muted border border-[#3e3b30]"
                                    >
                                      {f}
                                    </span>
                                  ))
                                : "—"}
                            </div>
                          </td>
                          <td className="p-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass(row.status)}`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80" />
                              {statusDisplay}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Link
                                href={(`/admin/tables/${row.id}` as import("next").Route)}
                                className="p-1.5 hover:bg-[#37342a] rounded text-gourmet-muted hover:text-white transition-colors"
                                title="Edit"
                              >
                                <MdEdit className="text-[18px]" />
                              </Link>
                              <button
                                type="button"
                                onClick={() => handleDelete(row.id)}
                                disabled={deletingId === row.id}
                                className="p-1.5 hover:bg-[#37342a] rounded text-gourmet-muted hover:text-red-400 transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                <MdDelete className="text-[18px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            {!loading && total > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-[#3e3b30]">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 text-sm font-medium text-gourmet-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdChevronLeft className="text-[18px]" />
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg font-medium text-sm transition-colors ${
                          page === p
                            ? "bg-gourmet-primary text-gourmet-bg-dark"
                            : "hover:bg-[#37342a] text-gourmet-muted hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  {totalPages > 5 && (
                    <>
                      <span className="text-gourmet-muted">...</span>
                      <button
                        type="button"
                        onClick={() => setPage(totalPages)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#37342a] text-gourmet-muted hover:text-white font-medium text-sm"
                      >
                        {totalPages}
                      </button>
                    </>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 text-sm font-medium text-gourmet-muted hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <MdChevronRight className="text-[18px]" />
                </button>
              </div>
            )}
          </section>
    </div>
  );
}
