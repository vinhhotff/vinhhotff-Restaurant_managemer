"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { MdClose, MdRemove, MdAdd, MdRestaurantMenu, MdShoppingCart } from "react-icons/md";
import { ThemeToggle } from "@/components/theme-toggle";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  /** Optional subtitle e.g. "(Beef Noodle Soup)" */
  subtitle?: string;
};

const DEFAULT_RESTAURANT_ID = 1;

/** Mock item when backend GET /api/menus/:id is not available */
const MOCK_ITEM: MenuItem = {
  id: 1,
  name: "Signature Phở Bò",
  subtitle: "(Beef Noodle Soup)",
  description:
    "Slow-cooked beef bone broth infused with star anise, cinnamon, and charred ginger. Served with flat rice noodles, rare beef tenderloin slices, and fresh herbs. A comforting classic reimagined.",
  price: 89000,
  currency: "VND",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC48Z0GCDG37orwvbWwW3DxpyRbCqTcaifwRWHD8nqKY4gry6DQn_zArknFuri0JrUUR40n4R86tyFum_MA51hcGyAzjJlrOhZBfZTA773T4wpFeBf5vvIl_CkXbX2Xe8Y6QPpIqmv99M_3aEL6K686nAfTT1mHmzYPZ2K6O6ZgjZygPGgbd99Z4IBAsdrDa6zjVJ0XmJ43ddNsWHgiqFYM2geEdiHfen3eLAcNxGzMzt6U--VZFuaGWPspjCC3pJQLAsxj0LGivsdE",
  isAvailable: true,
};

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")} VND`;
}

export default function FoodItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const id = params?.id ? String(params.id) : null;
  const numericId = id ? parseInt(id, 10) : NaN;

  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id || Number.isNaN(numericId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    api
      .get<{ data: MenuItem }>(`/api/menus/${numericId}`)
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        if (data && typeof data === "object" && "name" in data) {
          setItem({
            id: (data as Record<string, unknown>).id as number,
            name: (data as Record<string, unknown>).name as string,
            description: (data as Record<string, unknown>).description as string | undefined,
            price: Number((data as Record<string, unknown>).price) ?? 0,
            currency: (data as Record<string, unknown>).currency as string | undefined,
            imageUrl: (data as Record<string, unknown>).imageUrl as string | null | undefined,
            isAvailable: Boolean((data as Record<string, unknown>).isAvailable ?? true),
          });
        } else {
          setItem({ ...MOCK_ITEM, id: numericId });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItem({ ...MOCK_ITEM, id: numericId });
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, numericId]);

  const goBack = () => router.push("/menu" as import("next").Route);

  const handleAddToCart = async () => {
    if (!item?.isAvailable) return;
    if (!user) {
      router.push(("/login?redirect=/menu/" + id) as import("next").Route);
      return;
    }
    setAdding(true);
    try {
      await api.post("/api/cartItems", {
        userId: Number(user.id),
        restaurantId: DEFAULT_RESTAURANT_ID,
        menuId: item.id,
        quantity,
        specialInstructions: specialInstructions.trim() || undefined,
      });
      goBack();
    } catch {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f7f6] dark:bg-[#201b12] font-display antialiased transition-colors duration-200">
        <nav className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] dark:border-[#37322a] bg-[#f8f7f6]/95 dark:bg-[#201b12]/95 backdrop-blur-sm px-6 py-3">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <Link href="/menu" className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gourmet-primary/10 text-gourmet-primary flex items-center justify-center">
                <MdRestaurantMenu className="text-[24px]" />
              </div>
              <span className="text-xl font-bold text-[#171512] dark:text-white">Gourmet Haven</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="text-gourmet-muted">Loading...</div>
        </div>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f7f6] dark:bg-[#201b12] font-display antialiased transition-colors duration-200">
        <nav className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] dark:border-[#37322a] bg-[#f8f7f6]/95 dark:bg-[#201b12]/95 backdrop-blur-sm px-6 py-3">
          <div className="max-w-[1440px] mx-auto flex items-center justify-between">
            <Link href="/menu" className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-gourmet-primary/10 text-gourmet-primary flex items-center justify-center">
                <MdRestaurantMenu className="text-[24px]" />
              </div>
              <span className="text-xl font-bold text-[#171512] dark:text-white">Gourmet Haven</span>
            </Link>
            <ThemeToggle />
          </div>
        </nav>
        <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-8 gap-4">
          <p className="text-[#171512] dark:text-white/80">Item not found.</p>
          <Link href="/menu" className="text-gourmet-primary font-medium hover:underline">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = item.price * quantity;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f6] dark:bg-[#201b12] font-display antialiased transition-colors duration-200">
      {/* Navbar - giống menu/cart, có ThemeToggle */}
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
          </div>
        </div>
      </nav>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#f8f7f6] dark:bg-[#201b12]" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gourmet-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gourmet-primary/5 blur-[120px]" />
      </div>

      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        {/* Modal-style card */}
        <div className="relative w-full max-w-6xl mx-auto shadow-2xl rounded-xl overflow-hidden bg-white dark:bg-[#2A251E] border border-[#e5e5e5] dark:border-[#37322a] flex flex-col lg:flex-row h-auto lg:min-h-[600px] animate-fade-in-up">
          {/* Close – mobile */}
          <Link
            href="/menu"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/10 dark:bg-black/20 text-[#171512] dark:text-white/70 hover:opacity-80 transition-all backdrop-blur-sm lg:hidden"
            aria-label="Close"
          >
            <MdClose className="text-[24px]" />
          </Link>

          {/* Left: Image */}
          <div className="w-full lg:w-7/12 relative min-h-[300px] lg:min-h-full group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={
                item.imageUrl
                  ? { backgroundImage: `url("${item.imageUrl}")` }
                  : undefined
              }
            >
              {!item.imageUrl && (
                <div className="w-full h-full flex items-center justify-center bg-[#e5e5e5] dark:bg-[#37322a] text-gourmet-muted text-sm">
                  No image
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-[#2A251E]/80 via-transparent to-transparent lg:hidden" />
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-5/12 flex flex-col bg-white dark:bg-[#2A251E] relative">
            {/* Close – desktop */}
            <div className="hidden lg:flex justify-end p-4 absolute top-0 right-0 z-10">
              <Link
                href="/menu"
                className="text-[#171512]/60 dark:text-white/40 hover:opacity-100 transition-colors p-1"
                aria-label="Close"
              >
                <MdClose className="text-3xl" />
              </Link>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10">
              <div className="mb-8">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-[#171512] dark:text-white leading-tight tracking-tight">
                    {item.name}
                    {item.subtitle && (
                      <span className="block text-xl lg:text-2xl font-medium text-[#6C6A66] dark:text-white/60 mt-1">
                        {item.subtitle}
                      </span>
                    )}
                  </h1>
                </div>
                <div className="flex items-center gap-3 my-4">
                  <span className="text-gourmet-primary text-2xl font-bold">
                    {formatPrice(item.price)}
                  </span>
                </div>
                <p className="text-[#6C6A66] dark:text-gourmet-muted text-base leading-relaxed font-normal">
                  {item.description ?? ""}
                </p>
              </div>

              <div className="w-full h-px bg-[#e5e5e5] dark:bg-white/10 my-6" />

              {/* Quantity */}
              <div className="mb-6">
                <label className="text-[#171512] dark:text-white text-sm font-semibold uppercase tracking-wider mb-3 block opacity-80">
                  Quantity
                </label>
                <div className="flex items-center gap-4 bg-[#f0f0f0] dark:bg-[#201b12]/50 w-fit p-1 pr-4 rounded-full border border-[#e5e5e5] dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-full bg-[#e5e5e5] dark:bg-[#37322a] hover:bg-gourmet-primary text-[#171512] dark:text-white hover:text-[#171512] dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <MdRemove className="text-lg" />
                  </button>
                  <span className="text-xl font-bold text-[#171512] dark:text-white min-w-[30px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 rounded-full bg-gourmet-primary text-[#171512] dark:text-white hover:opacity-90 flex items-center justify-center cursor-pointer shadow-lg transition-all"
                    aria-label="Increase quantity"
                  >
                    <MdAdd className="text-lg" />
                  </button>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-8">
                <label className="flex flex-col w-full">
                  <span className="text-[#171512] dark:text-white text-sm font-semibold uppercase tracking-wider mb-3 opacity-80">
                    Special Instructions
                  </span>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    className="w-full resize-none rounded-lg text-[#171512] dark:text-white placeholder:text-[#6C6A66] dark:placeholder-gourmet-muted/50 bg-[#f8f7f6] dark:bg-[#201b12] border border-[#e5e5e5] dark:border-[#37322a] focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary focus:outline-none min-h-[120px] p-4 text-base transition-colors"
                    placeholder="e.g., No spicy, extra lime, no onions..."
                  />
                </label>
              </div>
            </div>

            {/* Bottom action bar */}
            <div className="p-6 lg:p-10 border-t border-[#e5e5e5] dark:border-white/10 bg-white dark:bg-[#2A251E] z-10 mt-auto">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!item.isAvailable || adding}
                className="w-full group relative flex items-center justify-between overflow-hidden rounded-xl px-6 py-4 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-gourmet-primary text-[#171512] dark:text-white font-bold shadow-lg hover:shadow-gourmet-primary/20"
              >
                <span className="text-lg group-hover:translate-x-1 transition-transform relative z-10">
                  Add to Cart
                </span>
                <span className="text-lg opacity-90 relative z-10">
                  {formatPrice(totalPrice)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
