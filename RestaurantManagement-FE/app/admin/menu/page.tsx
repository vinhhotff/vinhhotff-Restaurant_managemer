"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import {
  MdDashboard,
  MdRestaurantMenu,
  MdReceiptLong,
  MdInventory2,
  MdGroup,
  MdSettings,
  MdNotifications,
  MdHelp,
  MdSearch,
  MdExpandMore,
  MdFileDownload,
  MdAdd,
  MdEdit,
  MdDelete,
  MdRamenDining,
  MdCheckCircle,
  MdRemoveCircleOutline,
  MdChevronLeft,
  MdChevronRight,
} from "react-icons/md";

type MenuItem = {
  id: number;
  name: string;
  sku?: string;
  category?: string;
  price: number;
  currency?: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  createdAt: string;
};

const CATEGORIES = ["All Categories", "Starters", "Main Course", "Desserts", "Beverages"];

const MOCK_MENUS: MenuItem[] = [
  {
    id: 1,
    name: "Phở Bò Đặc Biệt",
    sku: "VN-001",
    category: "Main Course",
    price: 85000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBeMfA_5I4WsypmQtD9QmeWrNUcGLhixhDZqXvuJlUrlW89fSedVh-c891ituhrm0wJ5QSU7Ah5zAKQ5tqXLhnKtizP3ApVAQHTgK-o_koaSnb_vQ4Ossq7x7AMPhb4-5cSapRAjgvLSv7g-lNOP7ZZh9pgUuRCRKhls5PVE2FL9rlE85LiDoYrWq9laBYIfGLOl1OhUdCRWjMFmZCyoTLant7hkOUNYnR8eo78aNglgKGgPL_ulEX8Vk4gAQCP2X8C7ucrNOYR3iLO",
    isAvailable: true,
    createdAt: "Oct 24, 2023",
  },
  {
    id: 2,
    name: "Gỏi Cuốn Tôm Thịt",
    sku: "VN-004",
    category: "Appetizer",
    price: 45000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC05bpKUu_YzjN8HtSRsBpZOIP4c4amD3fho1IenaUaeRsFyG-2_V69AK9eYxGgHyu3N-TizmHpSP47S3spdzvEN1TfSdwuzwQbOZ_8cmLagQ6kWordtGHDpzK9blc4U2MvjjuM5i9UIUpTXJKQbb91GMnGhjWUHln_MpTRmEWJ1C-GuIoBM4JbGvxcTHCwBxR0wgSqcZ6HX_zrEeZsNJ1bBVvlk6rGjVdLT07a5ZS9Ovi8OPaSM0KZqAgaWHV3nDDU9R9z97VJkssN",
    isAvailable: true,
    createdAt: "Oct 22, 2023",
  },
  {
    id: 3,
    name: "Cà Phê Sữa Đá",
    sku: "BV-012",
    category: "Beverage",
    price: 35000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDk3gqGyuJWzahwprxLC1W6BMQQZJ9B4jU3DseszTAaQZMH4ipVTl-ca-4F9l9LhanQ_oLN1AwTp3LrGLwkWU-m2KZPjn_BabXskdVKXx0dCwCZTqXRNe2qyT5IRN7uzU4lNP_E6QDOxDGKLk4wjKcdAtBK_lZNfVI2etV3fIDAZmMM3F3QIgHox3BNg3IyKk14YWu5hYKHEeov0G7FpC7tGvrxIQBFqCOcuwPm_0I76v-PqlNNkMFe_DBIgfJn-Nxnc6_UZOpbIWQG",
    isAvailable: false,
    createdAt: "Sep 15, 2023",
  },
  {
    id: 4,
    name: "Bánh Mì Pate",
    sku: "VN-009",
    category: "Main Course",
    price: 30000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJ01or-cneuIM_yPrAmXDsbEI82vNjj8FVdoAi2tAtWnbh8mWDZ9sfNpYynzWE5xPFWOHUHWy598xs4T7ehbmRxF2b7YRQ7ngU_ZJIv_cM0TmCLbTOHoQxZ4glWlYeCCoGlbBce8YLO-lS1lb0Z7Cqxtzgk70dW-UnuC1seWUkYPmTqi_JMK1EpeDIynCLQS6noOcI3Gecpj5QJGIHs05CJDhuirxTVfeKqqR0AECpDe1odCi623JMmpoG0uGfDD15mgG2fN-klJ1D",
    isAvailable: true,
    createdAt: "Oct 30, 2023",
  },
  {
    id: 5,
    name: "Bánh Xèo",
    sku: "VN-015",
    category: "Main Course",
    price: 65000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQ-n6Hd5lkMCrvaWj_OfiJKo8VYkb7IW7BYbKPxPc8FzkWOv4fgvEbEtfGbFeqGrw50-zP6h-ABeNz2oZHM76XkfTRg8IO5LKVcYQvDElKIOWSE2wvLCdPGXSWjeC506SaevbUOpqLxFRYs520Tiq-dPYywERqIff7qHspqEUl2rXJWSq11GYCEgEkm5jkDiaMra52NhCWRRDC82NkIzvERg4J0MTMYsR7ZECsXPTuP7GUMSuQVJ3sQrR03_EMxcs2ff63a_IknObA",
    isAvailable: true,
    createdAt: "Nov 02, 2023",
  },
];

function formatPrice(price: number, currency = "VND") {
  return `${price.toLocaleString("vi-VN")} ₫`;
}

function categoryClass(category: string) {
  switch (category) {
    case "Main Course":
      return "bg-gourmet-primary/20 text-gourmet-primary border-gourmet-primary/20";
    case "Appetizer":
      return "bg-blue-500/20 text-blue-400 border-blue-500/20";
    case "Beverage":
      return "bg-orange-500/20 text-orange-400 border-orange-500/20";
    default:
      return "bg-gourmet-primary/20 text-gourmet-primary border-gourmet-primary/20";
  }
}

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<{ data: { content?: MenuItem[]; totalElements?: number }; content?: MenuItem[] }>("/api/menus")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        const list = Array.isArray(data?.content) ? data.content : Array.isArray((res.data as { content?: MenuItem[] }).content) ? (res.data as { content: MenuItem[] }).content : [];
        if (list.length > 0) {
          setMenus(list.map((m: Record<string, unknown>) => ({
            id: m.id as number,
            name: (m.name as string) ?? "",
            sku: m.sku as string | undefined,
            category: m.category as string | undefined,
            price: Number(m.price) ?? 0,
            currency: (m.currency as string) ?? "VND",
            imageUrl: (m.imageUrl as string | null) ?? null,
            isAvailable: Boolean(m.isAvailable ?? true),
            createdAt: m.createdAt ? (typeof m.createdAt === "string" ? m.createdAt : new Date(m.createdAt as number).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })) : "",
          })));
          setUseMockData(false);
        } else {
          setMenus(MOCK_MENUS);
          setUseMockData(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMenus(MOCK_MENUS);
          setUseMockData(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = menus;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.sku && m.sku.toLowerCase().includes(q)) ||
          (m.category && m.category.toLowerCase().includes(q))
      );
    }
    if (categoryFilter !== "All Categories") {
      list = list.filter((m) => m.category === categoryFilter);
    }
    return list;
  }, [menus, search, categoryFilter]);

  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const pageItems = filtered.slice(start, start + pageSize);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const totalDishes = menus.length;
  const activeItems = menus.filter((m) => m.isAvailable).length;
  const outOfStock = menus.filter((m) => !m.isAvailable).length;

  return (
    <div className="flex h-screen w-full font-display antialiased overflow-hidden bg-[#f8f8f6] dark:bg-gourmet-surface text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-gourmet-bg-dark border-r border-gourmet-border h-full shrink-0">
        <div className="flex items-center gap-3 p-6 border-b border-gourmet-border">
          <div className="size-10 rounded-full border border-gourmet-primary/20 bg-gourmet-primary/10 flex items-center justify-center">
            <span className="text-gourmet-primary font-bold">G</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-base font-bold leading-none tracking-tight">Gourmet Admin</h1>
            <p className="text-gourmet-muted text-xs font-normal mt-1">Fine Dining Manager</p>
          </div>
        </div>
        <nav className="flex-1 flex flex-col gap-2 p-4 overflow-y-auto">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gourmet-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <MdDashboard className="text-[20px]" />
            <p className="text-sm font-medium">Dashboard</p>
          </Link>
          <Link
            href="/admin/menu"
            className="flex items-center gap-3 px-3 py-3 rounded-lg bg-gourmet-primary/10 border border-gourmet-primary/20 text-gourmet-primary"
          >
            <MdRestaurantMenu className="text-[20px]" />
            <p className="text-sm font-bold">Menu Catalog</p>
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gourmet-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <MdReceiptLong className="text-[20px]" />
            <p className="text-sm font-medium">Orders</p>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gourmet-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <MdInventory2 className="text-[20px]" />
            <p className="text-sm font-medium">Inventory</p>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gourmet-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <MdGroup className="text-[20px]" />
            <p className="text-sm font-medium">Staff</p>
          </a>
        </nav>
        <div className="p-4 border-t border-gourmet-border">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-gourmet-muted hover:text-white hover:bg-white/5 transition-colors"
          >
            <MdSettings className="text-[20px]" />
            <p className="text-sm font-medium">Settings</p>
          </a>
          <div className="flex items-center gap-3 px-3 py-3 mt-2">
            <div className="size-8 rounded-full bg-gourmet-primary/20 flex items-center justify-center">
              <span className="text-gourmet-primary text-sm font-medium">A</span>
            </div>
            <div className="flex flex-col min-w-0">
              <p className="text-white text-sm font-medium leading-none truncate">Admin</p>
              <p className="text-gourmet-muted text-xs mt-1">Head Chef</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gourmet-surface relative">
        <header className="h-16 flex items-center justify-between border-b border-gourmet-border px-8 bg-gourmet-bg-dark/50 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4 text-white">
            <h2 className="text-lg font-bold leading-tight tracking-tight">Catalog Management</h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 text-white transition-colors relative"
            >
              <MdNotifications className="text-[24px]" />
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-gourmet-bg-dark" />
            </button>
            <button
              type="button"
              className="flex items-center justify-center size-10 rounded-full hover:bg-white/10 text-white transition-colors"
            >
              <MdHelp className="text-[24px]" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {useMockData && (
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                Backend Menu API chưa có. Đang hiển thị dữ liệu mẫu.
              </div>
            )}

            {/* Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gourmet-bg-dark border border-gourmet-border rounded-xl p-6 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-gourmet-muted text-sm font-medium">Total Dishes</p>
                  <MdRamenDining className="text-gourmet-primary text-[24px]" />
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {loading ? "—" : totalDishes}
                </p>
                <div className="flex items-center gap-1 text-xs text-green-400">
                  <span>+2 this week</span>
                </div>
              </div>
              <div className="bg-gourmet-bg-dark border border-gourmet-border rounded-xl p-6 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-gourmet-muted text-sm font-medium">Active Items</p>
                  <MdCheckCircle className="text-green-400 text-[24px]" />
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {loading ? "—" : activeItems}
                </p>
              </div>
              <div className="bg-gourmet-bg-dark border border-gourmet-border rounded-xl p-6 flex flex-col gap-2 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-gourmet-muted text-sm font-medium">Out of Stock</p>
                  <MdRemoveCircleOutline className="text-red-400 text-[24px]" />
                </div>
                <p className="text-3xl font-bold text-white tracking-tight">
                  {loading ? "—" : outOfStock}
                </p>
              </div>
            </section>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-1 items-center gap-3 min-w-[300px]">
                <div className="relative flex-1 max-w-md group">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gourmet-muted group-focus-within:text-gourmet-primary transition-colors">
                    <MdSearch className="text-[20px]" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search by name, SKU, or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gourmet-bg-dark border border-gourmet-border rounded-lg text-sm text-white placeholder-gourmet-muted focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary transition-all"
                  />
                </div>
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="appearance-none bg-gourmet-bg-dark border border-gourmet-border text-white text-sm rounded-lg focus:ring-gourmet-primary focus:border-gourmet-primary block w-full pl-3 pr-10 py-2.5 cursor-pointer min-w-[140px]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gourmet-muted">
                    <MdExpandMore className="text-[20px]" />
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gourmet-bg-dark border border-gourmet-border text-white rounded-lg hover:bg-white/5 transition-all text-sm font-bold"
                >
                  <MdFileDownload className="text-[20px]" />
                  Export
                </button>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 bg-gourmet-primary hover:bg-gourmet-primary/90 text-gourmet-bg-dark rounded-lg transition-all shadow-lg shadow-gourmet-primary/20 text-sm font-bold"
                >
                  <MdAdd className="text-[20px]" />
                  Add New Dish
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="bg-gourmet-bg-dark border border-gourmet-border rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="px-6 py-12 text-center text-gourmet-muted">Loading...</div>
                ) : (
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-white/5 border-b border-gourmet-border text-gourmet-muted">
                        <th className="px-6 py-4 font-medium w-16" scope="col">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 bg-gourmet-surface border-gourmet-border rounded text-gourmet-primary focus:ring-gourmet-primary focus:ring-offset-gourmet-surface"
                            />
                          </div>
                        </th>
                        <th className="px-6 py-4 font-medium" scope="col">Item Details</th>
                        <th className="px-6 py-4 font-medium" scope="col">Category</th>
                        <th className="px-6 py-4 font-medium text-right" scope="col">Price (VND)</th>
                        <th className="px-6 py-4 font-medium text-center" scope="col">Availability</th>
                        <th className="px-6 py-4 font-medium" scope="col">Created Date</th>
                        <th className="px-6 py-4 font-medium text-right" scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gourmet-border text-white">
                      {pageItems.map((row) => (
                        <tr
                          key={row.id}
                          className={`hover:bg-white/5 transition-colors group ${!row.isAvailable ? "opacity-60" : ""}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                className="w-4 h-4 bg-gourmet-surface border-gourmet-border rounded text-gourmet-primary focus:ring-gourmet-primary focus:ring-offset-gourmet-surface"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div
                                className="size-12 rounded-lg border border-gourmet-border shrink-0 bg-gourmet-surface bg-cover bg-center"
                                style={
                                  row.imageUrl
                                    ? { backgroundImage: `url(${row.imageUrl})` }
                                    : undefined
                                }
                              >
                                {!row.imageUrl && (
                                  <div className="w-full h-full flex items-center justify-center text-gourmet-muted text-xs">
                                    No img
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-bold text-base text-white">{row.name}</span>
                                <span className="text-xs text-gourmet-muted">
                                  {row.sku ? `SKU: ${row.sku}` : `#${row.id}`}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {row.category && (
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${categoryClass(row.category)}`}
                              >
                                {row.category}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right font-mono text-base">
                            {formatPrice(row.price, row.currency)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={row.isAvailable}
                                readOnly
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gourmet-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gourmet-primary" />
                            </label>
                          </td>
                          <td className="px-6 py-4 text-gourmet-muted text-sm">
                            {row.createdAt}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                type="button"
                                className="p-2 text-gourmet-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <MdEdit className="text-[20px]" />
                              </button>
                              <button
                                type="button"
                                className="p-2 text-gourmet-muted hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                title="Delete"
                              >
                                <MdDelete className="text-[20px]" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {/* Pagination */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-gourmet-border bg-white/5">
                <span className="text-sm text-gourmet-muted">
                  Showing <span className="font-medium text-white">{total === 0 ? 0 : start + 1}</span> to{" "}
                  <span className="font-medium text-white">{Math.min(start + pageSize, total)}</span> of{" "}
                  <span className="font-medium text-white">{total}</span> results
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-1 rounded hover:bg-white/10 text-gourmet-muted disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <MdChevronLeft className="text-[20px]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                    className="p-1 rounded hover:bg-white/10 text-white disabled:opacity-50 disabled:hover:bg-transparent"
                  >
                    <MdChevronRight className="text-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
