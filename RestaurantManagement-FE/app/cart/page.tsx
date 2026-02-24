"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { MdRemove, MdAdd, MdDelete, MdArrowBack, MdRestaurantMenu, MdShoppingCart } from "react-icons/md";
import { ThemeToggle } from "@/components/theme-toggle";

type CartItem = {
  id: number;
  menuId?: number;
  quantity?: number;
  specialInstructions?: string;
  menuName?: string;
  price?: number;
  imageUrl?: string;
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = () => {
    api
      .get<CartItem[] | { data: CartItem[] }>("/api/cartItems")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data as { data?: CartItem[] })?.data ?? [];
        setItems(Array.isArray(data) ? data : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQty = async (id: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await api.put(`/api/cartItems/${id}`, { quantity });
      fetchCart();
    } catch {
      // ignore
    }
  };

  const removeItem = async (id: number) => {
    try {
      await api.delete(`/api/cartItems/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {
      // ignore
    }
  };

  const subtotal = items.reduce((sum, i) => sum + (i.quantity ?? 0) * (i.price ?? 0), 0);
  const formatPrice = (n: number) => `${(n ?? 0).toLocaleString("vi-VN")} ₫`;

  return (
    <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#201b12] font-display text-[#171512] dark:text-white antialiased overflow-x-hidden flex flex-col transition-colors duration-200">
      {/* Navbar - giống menu/profile, có ThemeToggle */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] dark:border-[#37322a] bg-[#f8f7f6]/95 dark:bg-[#201b12]/95 backdrop-blur-sm px-6 py-3">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-4">
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
          </div>
        </div>
      </nav>

      <div className="flex-1 justify-center py-5 px-4 md:px-8 lg:px-12 xl:px-40">
        <div className="flex flex-col max-w-[1200px] flex-1 mx-auto">
          <div className="flex flex-wrap gap-2 p-4">
            <Link href="/menu" className="text-gourmet-muted text-sm font-medium hover:text-gourmet-primary transition-colors">Menu</Link>
            <span className="text-gourmet-muted text-sm">/</span>
            <span className="text-[#171512] dark:text-white text-sm font-medium">Cart</span>
          </div>
          <div className="flex flex-wrap justify-between gap-3 px-4 pt-2 pb-6">
            <div className="flex min-w-72 flex-col gap-2">
              <h1 className="text-[#171512] dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">Your Selection</h1>
              <p className="text-gourmet-muted text-base font-normal">Review items before pre-ordering to ensure accuracy.</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 px-4">
            <div className="flex-1 min-w-0">
              <div className="overflow-hidden rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E]/80">
                {loading ? (
                  <div className="p-8 text-center text-gourmet-muted">Loading…</div>
                ) : items.length === 0 ? (
                  <div className="p-8 text-center text-gourmet-muted">
                    <p>Your cart is empty.</p>
                    <Link href="/menu" className="inline-block mt-4 text-gourmet-primary hover:underline font-medium">Continue Ordering</Link>
                  </div>
                ) : (
                  <table className="flex-1 w-full">
                    <thead>
                      <tr className="bg-white dark:bg-[#2A251E] border-b border-[#e5e5e5] dark:border-[#37322a]">
                        <th className="px-4 py-4 text-left text-gourmet-muted w-16 text-xs font-medium uppercase tracking-wider">Item</th>
                        <th className="px-4 py-4 text-left text-gourmet-muted text-xs font-medium uppercase tracking-wider">Description</th>
                        <th className="hidden md:table-cell px-4 py-4 text-left text-gourmet-muted w-32 text-xs font-medium uppercase tracking-wider">Price</th>
                        <th className="px-4 py-4 text-left text-gourmet-muted w-32 text-xs font-medium uppercase tracking-wider">Quantity</th>
                        <th className="hidden sm:table-cell px-4 py-4 text-right text-gourmet-muted w-32 text-xs font-medium uppercase tracking-wider">Total</th>
                        <th className="px-4 py-4 text-center text-gourmet-muted w-12" />
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((row) => (
                        <tr key={row.id} className="border-b border-[#e5e5e5] dark:border-[#37322a] hover:bg-black/5 dark:hover:bg-white/5 transition-colors group">
                          <td className="p-4 align-middle">
                            <div
                              className="aspect-square w-16 h-16 rounded-lg border border-[#e5e5e5] dark:border-[#37322a] bg-gourmet-primary/10 flex items-center justify-center text-gourmet-primary font-bold text-lg"
                              style={row.imageUrl ? { backgroundImage: `url(${row.imageUrl})`, backgroundSize: "cover" } : undefined}
                            >
                              {!row.imageUrl && (row.menuName ?? "?").charAt(0)}
                            </div>
                          </td>
                          <td className="p-4 align-middle">
                            <div className="flex flex-col">
                              <span className="text-[#171512] dark:text-white text-base font-bold">{row.menuName ?? `Item #${row.menuId ?? row.id}`}</span>
                              <span className="md:hidden text-gourmet-muted text-sm mt-1">{formatPrice(row.price ?? 0)}</span>
                            </div>
                          </td>
                          <td className="hidden md:table-cell p-4 align-middle text-gourmet-muted text-sm font-medium">{formatPrice(row.price ?? 0)}</td>
                          <td className="p-4 align-middle">
                            <div className="flex items-center w-24 rounded-lg border border-[#e5e5e5] dark:border-[#37322a] bg-[#f8f7f6] dark:bg-[#201b12]">
                              <button
                                type="button"
                                onClick={() => updateQty(row.id, Math.max(1, (row.quantity ?? 1) - 1))}
                                className="w-8 h-8 flex items-center justify-center text-gourmet-muted hover:text-[#171512] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-l-lg transition-colors"
                              >
                                <MdRemove className="text-base" />
                              </button>
                              <span className="w-8 bg-transparent text-center text-[#171512] dark:text-white text-sm font-medium p-0 border-none">{row.quantity ?? 1}</span>
                              <button
                                type="button"
                                onClick={() => updateQty(row.id, (row.quantity ?? 1) + 1)}
                                className="w-8 h-8 flex items-center justify-center text-gourmet-muted hover:text-[#171512] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-r-lg transition-colors"
                              >
                                <MdAdd className="text-base" />
                              </button>
                            </div>
                          </td>
                          <td className="hidden sm:table-cell p-4 align-middle text-right text-[#171512] dark:text-white text-base font-bold">
                            {formatPrice((row.quantity ?? 0) * (row.price ?? 0))}
                          </td>
                          <td className="p-4 align-middle text-center">
                            <button
                              type="button"
                              onClick={() => removeItem(row.id)}
                              className="text-gourmet-muted hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10"
                            >
                              <MdDelete className="text-[20px]" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div className="mt-6 flex justify-start">
                <Link href="/menu" className="group flex items-center gap-2 text-gourmet-muted hover:text-gourmet-primary transition-colors text-sm font-medium">
                  <MdArrowBack className="text-lg transition-transform group-hover:-translate-x-1" />
                  Continue Ordering
                </Link>
              </div>
            </div>

            <div className="w-full lg:w-[380px] shrink-0">
              <div className="rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] p-6 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-[#171512] dark:text-white">Order Summary</h2>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gourmet-muted">Subtotal</span>
                  <span className="font-medium text-[#171512] dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="h-px bg-[#e5e5e5] dark:bg-[#37322a] my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-[#171512] dark:text-white">Total</span>
                  <span className="text-xl font-black text-gourmet-primary">{formatPrice(subtotal)}</span>
                </div>
                <button
                  type="button"
                  disabled={items.length === 0}
                  className="mt-4 w-full py-3 rounded-lg bg-gourmet-primary text-[#171512] dark:text-white font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Proceed to Pre-order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
