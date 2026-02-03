"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { MdClose, MdRemove, MdAdd } from "react-icons/md";

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
        userId: user.id,
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
      <div className="min-h-screen flex items-center justify-center bg-[#121212] font-display antialiased p-4 lg:p-8">
        <div className="text-white/60">Loading...</div>
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#121212] font-display antialiased p-4 lg:p-8 gap-4">
        <p className="text-white/80">Item not found.</p>
        <Link
          href="/menu"
          className="text-gourmet-primary font-medium hover:underline"
          style={{ color: "#f4c325" }}
        >
          Back to Menu
        </Link>
      </div>
    );
  }

  const totalPrice = item.price * quantity;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212] font-display antialiased p-4 lg:p-8">
      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[#121212]" />
        <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#f4c325]/5 blur-[120px]" />
        <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#f4c325]/5 blur-[120px]" />
      </div>

      {/* Modal-style card */}
      <div className="relative w-full max-w-6xl mx-auto shadow-2xl rounded-xl overflow-hidden bg-gourmet-surface flex flex-col lg:flex-row h-auto lg:min-h-[600px] animate-fade-in-up">
        {/* Close – mobile */}
        <Link
          href="/menu"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 text-white/70 hover:bg-black/40 hover:text-white transition-all backdrop-blur-sm lg:hidden"
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
              <div className="w-full h-full flex items-center justify-center bg-gourmet-bg-dark text-gourmet-muted text-sm">
                No image
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-gourmet-surface/80 via-transparent to-transparent lg:hidden" />
        </div>

        {/* Right: Details */}
        <div className="w-full lg:w-5/12 flex flex-col bg-gourmet-surface relative">
          {/* Close – desktop */}
          <div className="hidden lg:flex justify-end p-4 absolute top-0 right-0 z-10">
            <Link
              href="/menu"
              className="text-white/40 hover:text-white transition-colors p-1"
              aria-label="Close"
            >
              <MdClose className="text-3xl" />
            </Link>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="mb-8">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
                  {item.name}
                  {item.subtitle && (
                    <span className="block text-xl lg:text-2xl font-medium text-white/60 mt-1">
                      {item.subtitle}
                    </span>
                  )}
                </h1>
              </div>
              <div className="flex items-center gap-3 my-4">
                <span className="text-gourmet-primary text-2xl font-bold" style={{ color: "#f4c325" }}>
                  {formatPrice(item.price)}
                </span>
              </div>
              <p className="text-[#bab39c] text-base leading-relaxed font-normal">
                {item.description ?? ""}
              </p>
            </div>

            <div className="w-full h-px bg-white/10 my-6" />

            {/* Quantity */}
            <div className="mb-6">
              <label className="text-white text-sm font-semibold uppercase tracking-wider mb-3 block opacity-80">
                Quantity
              </label>
              <div className="flex items-center gap-4 bg-[#2f2b1d]/50 w-fit p-1 pr-4 rounded-full border border-white/5">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-full bg-gourmet-border hover:bg-gourmet-primary hover:text-gourmet-bg-dark text-white flex items-center justify-center transition-all cursor-pointer"
                  style={{ backgroundColor: "#393528" }}
                  aria-label="Decrease quantity"
                >
                  <MdRemove className="text-lg" />
                </button>
                <span className="text-xl font-bold text-white min-w-[30px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="w-10 h-10 rounded-full bg-gourmet-primary text-gourmet-bg-dark hover:bg-white hover:text-gourmet-bg-dark flex items-center justify-center cursor-pointer shadow-lg transition-all"
                  style={{ backgroundColor: "#f4c325", boxShadow: "0 0 20px rgba(244,195,37,0.2)" }}
                  aria-label="Increase quantity"
                >
                  <MdAdd className="text-lg" />
                </button>
              </div>
            </div>

            {/* Special Instructions */}
            <div className="mb-8">
              <label className="flex flex-col w-full">
                <span className="text-white text-sm font-semibold uppercase tracking-wider mb-3 opacity-80">
                  Special Instructions
                </span>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full resize-none rounded-lg text-white placeholder:text-[#bab39c]/50 bg-[#2f2b1d] border border-gourmet-border focus:border-gourmet-primary focus:ring-1 focus:ring-gourmet-primary focus:outline-none min-h-[120px] p-4 text-base transition-colors"
                  placeholder="e.g., No spicy, extra lime, no onions..."
                />
              </label>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="p-6 lg:p-10 border-t border-white/10 bg-gourmet-surface z-10 mt-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={!item.isAvailable || adding}
              className="w-full group relative flex items-center justify-between overflow-hidden rounded-xl px-6 py-4 transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed bg-[#f4c325] text-gourmet-bg-dark shadow-lg hover:shadow-gourmet-primary/20"
            >
              <span className="font-bold text-lg group-hover:translate-x-1 transition-transform relative z-10">
                Add to Cart
              </span>
              <span className="font-bold text-lg opacity-90 relative z-10">
                {formatPrice(totalPrice)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
