"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  MdRestaurantMenu,
  MdSearch,
  MdShoppingCart,
  MdAddShoppingCart,
  MdBlock,
  MdLocalFireDepartment,
} from "react-icons/md";

type MenuItem = {
  id: number;
  name: string;
  description?: string;
  price: number;
  currency?: string;
  imageUrl?: string | null;
  isAvailable: boolean;
  category?: string;
};

const CATEGORIES = ["All", "Appetizers", "Main Course", "Desserts", "Drinks"];

const MOCK_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: "Grilled Lemongrass Pork",
    description: "Marinated pork shoulder served with vermicelli, fresh herbs, and dipping sauce.",
    price: 150000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBzruB9a_LrVTPF21WMIz7bnGKoTPNGFa53jYB3kaUp1-aXiBIC74q3TYyFknj8LL8gJBMMi-y8409Yo_FsDm027PFN9PTbnlA6UhfJXexsSRUydYHqkJGYRC6OsK2Ys2C1gtfMGQhkFcd827_HsKSOHGM9xfGwULUiaWzIrVQX0vaenmiUtPWGx2D2OjwjvC8yz4k7hyIxijq4HH7EX9ujyu4nmpIimFM-j6fSeLwJDXN0wFcranTzFfLFJp8kys7isXesukLQY4JZ",
    isAvailable: true,
    category: "Main Course",
  },
  {
    id: 2,
    name: "Pho Bo Special",
    description: "Our signature beef noodle soup with brisket, flank, tendon, and meatballs.",
    price: 120000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7Npk8HUbe_M9pDonYoiUNCdDPreP06obEdMfOF1rwWXXEB_LcDi49RWvFe0_tzS9hjA2bPPUPXiV0XjCIxwYZNGQK_Oy8-cnzWI2vQBgcMkYyDjt3j906is8mgPKBvutzK8Y_5hhTBXPxnTKRuswMg8e3EEoRlcgtdbkhKLWlCsv-L0phPayyK4S1-iFHqKIDTzxN52Jv6nadXrXJ67dU5o4ARvt-1o29LU_PLsVJL0plj9Md9JjTbocxyG8OD0tkeB8JkZQ2WXqt",
    isAvailable: true,
    category: "Main Course",
  },
  {
    id: 3,
    name: "Coconut Curry Shrimp",
    description: "Rich and creamy coconut curry sauce with fresh tiger prawns and basil.",
    price: 185000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAK1cOTvqTXsWpU-m13qolWQ4McEuaV2dWa-YHalWGR0bQFcn3IQkVH9vJYlZBqU4mxrFOQwMqrt0nbUp9CiykcM-LZnQUB2phaGsi1jQ2Wz6pkCXVoY_7yJu9L0BQE2-mZTAH6FkZ6KjHgKOKtmwx16XYUl1Ce1oNs4deGV5OVgGsQyduG55co19THVn89nx8jLznHseGBYYfkYWuq9pNznVoHnBOEg-vadmudrokt0faXyy6huEpTPn1Npqbxym4yWOt7P7Wys2gq",
    isAvailable: false,
    category: "Main Course",
  },
  {
    id: 4,
    name: "Summer Garden Salad",
    description: "Fresh organic greens, avocado, cherry tomatoes, and sesame vinaigrette.",
    price: 95000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6K_9MpomOIkORbhUQ7X3RPBaSURqWNXcA8VDb-6mSvQpm7G1yeJD_owSeERES_0o-64qLtUD1vT7zoZKXhvPAb8SqytAt1rJZOh9sLEeQamJHEbIaECnBFn-tmFmSC6cZDywAxL5jJbCLWTUXAj-cgGZN62T_Rtlz206YwVXqhsh73_PtQ4SCNv7TohO3VA55rjZ-rdokQzNvtCLS3b_NU2OJiOnO792RM2p3AGjKP7mciqxHDSroN4x2gMP0P6EGQp2BsROs3Ilv",
    isAvailable: true,
    category: "Appetizers",
  },
  {
    id: 5,
    name: "Lychee Martini",
    description: "Vodka shaken with sweet lychee juice and vermouth, garnished with fruit.",
    price: 110000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCi19y4W8iAYWYqTBIa9w19xD--QnebwkF4EsI3fAf0kEJVxHpZq_BR_Cdfmt-kjJbS_lnO87O0RfmPi31gp_hknhXjNQJ8NBHdteAr8jOX92XyNLVaFutO_isLrRSv9Dow6NqSVLR94mRQGlw83ZLGzWw0oYrCaVCZh5Gp9MhTDq4hFP34WkLUQ8ecUGVLNtKVfQJVdFsMOZ6fj7bnxSTffjJg4uvlb-zdOJ_tyI_1Ej4bWJ6e9eZnWWVjDjnCBpR95jVVJ1ZBvqQE",
    isAvailable: true,
    category: "Drinks",
  },
  {
    id: 6,
    name: "Molten Lava Cake",
    description: "Warm chocolate cake with a gooey center, served with vanilla bean ice cream.",
    price: 135000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBKZEtmCpfZ61YPz6jK4bDbbOfV7BXabOFFNdbnLr1LtAnDJg7toKPCeI0kNqzxDqSLCQFWlbVDIiyOKOwtDhDhF1nRYWhQWBx1FNMocSsjUClyKUynOgOlP_C3wMV9kSepU-HqSbQ1PQ0Xk3BA_9z5mVDi2eTj6IpKDnO7ra9xs4lneIc4Zgf5vIeY0JObtrmE6TSo1Vg002dYf8qNLzZswT_ZJLsBPsYdQ4a6usUbI_AjoNJQuj-w3oJpzqYzU7gJZ7l-fS1cw6Om",
    isAvailable: true,
    category: "Desserts",
  },
];

const MOCK_POPULAR: MenuItem[] = [
  {
    id: 10,
    name: "Buddha Bowl",
    description: "Vegetarian favorite",
    price: 85000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDVNSaYc2G984IpwZeGcIJPyPxGz3kke1xGoA2s6OE1XXzsESwkYFm0YauKn2KuFDHpXqkU78nM8QOTecuLVTeePeWpDR-rE4MAPtW6PwsisO9jyd523Tq1LKREAYiP73MG9VJyqJGxNC7jAiObQ5j2raEb4uYFHlFY7-AMhmYgY73RW4KtEinBckNTg51xk4vas8YojAx4DDATjWPCAzpXBWzQ_fDjhSMHxG5YVkvnr-GXLaP7iw-kh8urbJdN9wz_x16McYTEhrC3",
    isAvailable: true,
  },
  {
    id: 11,
    name: "Classic Burger",
    description: "Best seller",
    price: 140000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDJpAJLYM7tWOFy204qZB2oNxDJT6uvcNoTM7MAIq-NLMpJbZ41s-qo6-hYb6AEB5cP4259eygnpMMyqLHFzkSrn6Fx2-Z3GVpXJn06KXATs5Mpl7K_YJJ-mEOThWjtE4LapGNY8EHJINdN1EJ2-YCE41QdrwTsjJ9oPvBU6OtIKn6MKkD913FrghoYAFmsVoJrHxI6_uF4udxWlY-kMAzH84buSQMtqNuqIaS0scy5XT_hvFiCguy1wvXWGxuTND9VHjAEzdyyJXg7",
    isAvailable: true,
  },
  {
    id: 12,
    name: "Spring Rolls",
    description: "Crispy appetizer",
    price: 65000,
    currency: "VND",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBrPgxddWfOt-XIPK6g4p1UC5XbtR1Hw7R307FKLXNoJgHibz7iyBzLk0Hj6VHEzf-cab2yGU3lOAVYSF2Q9Sjb-aHdOvrgeRCd0OwJvD-QtSqHhKws0A8StJm0KUxGUJEHj54j9vfNOy8jiV2BjTO4rVyBVoVfpSt34LFNAox6UYLWj28zXD0mJMZZ3BE_sMD8yj2rcRqEZ94X-VjV8iscjBSYvwMNnf-Skgc4KHpO1oUs4Wk97XC65vpEUJ62rpKdZE6HAPWwdhU4",
    isAvailable: true,
  },
];

const DEFAULT_RESTAURANT_ID = 1;

function formatPrice(price: number) {
  return `${price.toLocaleString("vi-VN")}đ`;
}

export default function CustomerMenuGalleryPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [popular, setPopular] = useState<MenuItem[]>(MOCK_POPULAR);
  const [loading, setLoading] = useState(true);
  const [useMock, setUseMock] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cartCount, setCartCount] = useState(0);
  const [addingId, setAddingId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    api
      .get<{ data: { content?: MenuItem[] }; content?: MenuItem[] }>("/api/menus")
      .then((res) => {
        if (cancelled) return;
        const data = res.data?.data ?? res.data;
        const list =
          Array.isArray(data?.content) ? data.content : Array.isArray((res.data as { content?: MenuItem[] }).content) ? (res.data as { content: MenuItem[] }).content : [];
        if (list.length > 0) {
          setItems(
            list.map((m: Record<string, unknown>) => ({
              id: m.id as number,
              name: (m.name as string) ?? "",
              description: (m.description as string) ?? undefined,
              price: Number(m.price) ?? 0,
              currency: (m.currency as string) ?? "VND",
              imageUrl: (m.imageUrl as string | null) ?? null,
              isAvailable: Boolean(m.isAvailable ?? true),
              category: (m.category as string) ?? undefined,
            }))
          );
          setUseMock(false);
        } else {
          setItems(MOCK_ITEMS);
          setUseMock(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setItems(MOCK_ITEMS);
          setUseMock(true);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }
    api
      .get<{ data: unknown[] }>("/api/cartItems")
      .then((res) => {
        const list = res.data?.data ?? [];
        setCartCount(Array.isArray(list) ? list.length : 0);
      })
      .catch(() => setCartCount(0));
  }, [user]);

  const filtered = useMemo(() => {
    let list = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          (m.description?.toLowerCase().includes(q))
      );
    }
    if (category !== "All") {
      list = list.filter((m) => m.category === category);
    }
    return list;
  }, [items, search, category]);

  const handleAddToCart = async (item: MenuItem) => {
    if (!item.isAvailable) return;
    if (!user) {
      window.location.href = "/login?redirect=/menu";
      return;
    }
    setAddingId(item.id);
    try {
      await api.post("/api/cartItems", {
        userId: user.id,
        restaurantId: DEFAULT_RESTAURANT_ID,
        menuId: item.id,
        quantity: 1,
      });
      setCartCount((c) => c + 1);
    } catch {
      // Backend may reject if menu/restaurant invalid; keep UI consistent
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className="font-display bg-[#f8f7f6] dark:bg-[#201b12] min-h-screen flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full border-b border-[#e5e5e5] dark:border-[#37322a] bg-[#f8f7f6]/95 dark:bg-[#201b12]/95 backdrop-blur-sm px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="size-10 flex items-center justify-center rounded-full bg-gourmet-primary/10 text-gourmet-primary">
              <MdRestaurantMenu className="text-[24px]" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#171512] dark:text-white">
              Gourmet Haven
            </h1>
          </Link>
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gourmet-muted">
                <MdSearch className="text-[20px]" />
              </span>
              <input
                type="text"
                placeholder="Search for dishes, ingredients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full rounded-lg border-none bg-[#e5e5e5] dark:bg-[#37322a] py-2.5 pl-10 pr-4 text-sm text-[#171512] dark:text-white placeholder-[#888] dark:placeholder-gourmet-muted focus:ring-2 focus:ring-gourmet-primary transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href={"/cart" as import("next").Route}
              className="relative p-2 text-[#171512] dark:text-white hover:text-gourmet-primary transition-colors"
            >
              <MdShoppingCart className="text-[24px]" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gourmet-primary text-[10px] font-bold text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <Link
                href={"/profile" as import("next").Route}
                className="h-9 w-9 rounded-full bg-gourmet-primary/20 border border-[#e5e5e5] dark:border-[#37322a] flex items-center justify-center text-gourmet-primary font-bold text-sm"
              >
                {user.fullName?.charAt(0) ?? "U"}
              </Link>
            ) : (
              <Link
                href={"/login?redirect=/menu" as import("next").Route}
                className="h-9 w-9 rounded-full bg-gourmet-primary/20 border border-[#e5e5e5] dark:border-[#37322a] flex items-center justify-center text-gourmet-primary font-bold text-sm"
              >
                ?
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 w-full max-w-[1440px] mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Menu Gallery */}
          <div className="lg:col-span-9 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#171512] dark:text-white tracking-tight mb-2">
                  Menu Gallery
                </h2>
                <p className="text-[#6C6A66] dark:text-gourmet-muted text-lg">
                  Explore our premium selection of culinary delights.
                </p>
              </div>
            </div>

            {/* Category Chips */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`flex-none px-6 py-2.5 rounded-full font-semibold text-sm transition-transform hover:scale-105 ${
                    category === c
                      ? "bg-gourmet-primary text-white shadow-lg shadow-gourmet-primary/20"
                      : "bg-white dark:bg-[#37322a] text-[#171512] dark:text-[#E8E6E3] border border-[#e5e5e5] dark:border-transparent font-medium hover:bg-[#f0f0f0] dark:hover:bg-[#4a433a]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Menu Grid */}
            {loading ? (
              <div className="text-center py-12 text-gourmet-muted">Loading menu...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((item) => (
                  <div
                    key={item.id}
                    className={`group relative flex flex-col bg-white dark:bg-[#2A251E] rounded-xl overflow-hidden shadow-sm border border-[#e5e5e5] dark:border-[#37322a] ${
                      item.isAvailable
                        ? "hover:shadow-xl hover:shadow-gourmet-primary/10 transition-all duration-300"
                        : ""
                    }`}
                  >
                    <Link
                      href={(`/menu/${item.id}` as import("next").Route)}
                      className="h-48 w-full overflow-hidden relative block"
                    >
                      {!item.isAvailable && (
                        <div className="absolute inset-0 bg-[#201b12]/70 z-10 flex items-center justify-center backdrop-blur-[2px]">
                          <span className="px-4 py-1 border border-white/50 text-white font-bold uppercase tracking-widest text-sm rounded">
                            Sold Out
                          </span>
                        </div>
                      )}
                      <div
                        className={`w-full h-full bg-cover bg-center transition-transform duration-500 ${
                          item.isAvailable ? "group-hover:scale-105" : "grayscale"
                        }`}
                        style={
                          item.imageUrl
                            ? { backgroundImage: `url('${item.imageUrl}')` }
                            : undefined
                        }
                      >
                        {!item.imageUrl && (
                          <div className="w-full h-full flex items-center justify-center bg-gourmet-surface text-gourmet-muted text-sm">
                            No image
                          </div>
                        )}
                      </div>
                    </Link>
                    <div
                      className={`p-5 flex flex-col flex-1 ${!item.isAvailable ? "opacity-60" : ""}`}
                    >
                      <Link
                        href={(`/menu/${item.id}` as import("next").Route)}
                        className="text-lg font-bold text-[#171512] dark:text-white leading-tight mb-2 block hover:text-gourmet-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-[#6C6A66] dark:text-gourmet-muted text-sm leading-relaxed mb-4 line-clamp-2">
                        {item.description ?? ""}
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-gourmet-primary text-lg font-bold">
                          {formatPrice(item.price)}
                        </span>
                        {item.isAvailable ? (
                          <button
                            type="button"
                            disabled={addingId === item.id}
                            onClick={() => handleAddToCart(item)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-gourmet-primary/10 hover:bg-gourmet-primary text-gourmet-primary hover:text-white rounded-lg transition-colors duration-200 font-medium text-sm disabled:opacity-70"
                          >
                            <MdAddShoppingCart className="text-[18px]" />
                            {addingId === item.id ? "Adding…" : "Add"}
                          </button>
                        ) : (
                          <span className="flex items-center justify-center gap-2 px-4 py-2 bg-[#e5e5e5] dark:bg-[#37322a] text-[#888] dark:text-[#6C6A66] rounded-lg font-medium text-sm cursor-not-allowed">
                            <MdBlock className="text-[18px]" />
                            Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="flex justify-center mt-6">
                <button
                  type="button"
                  onClick={() => setCategory("All")}
                  className="px-8 py-3 rounded-full border border-gourmet-primary/30 text-gourmet-primary font-bold text-sm hover:bg-gourmet-primary hover:text-white transition-all"
                >
                  Load More Dishes
                </button>
              </div>
            )}
          </div>

          {/* Right: Popular Items Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white dark:bg-[#2A251E] rounded-xl p-6 border border-[#e5e5e5] dark:border-[#37322a] sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <MdLocalFireDepartment className="text-gourmet-primary text-[24px]" />
                <h3 className="text-lg font-bold text-[#171512] dark:text-white uppercase tracking-wider">
                  Popular Items
                </h3>
              </div>
              <div className="space-y-5">
                {popular.map((p) => (
                  <div key={p.id} className="flex gap-4 group cursor-pointer">
                    <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden">
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-300"
                        style={
                          p.imageUrl
                            ? { backgroundImage: `url('${p.imageUrl}')` }
                            : undefined
                        }
                      >
                        {!p.imageUrl && (
                          <div className="w-full h-full bg-gourmet-surface flex items-center justify-center text-gourmet-muted text-xs">
                            —
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-[#171512] dark:text-white font-bold text-sm leading-tight mb-1 group-hover:text-gourmet-primary transition-colors">
                        {p.name}
                      </h4>
                      <p className="text-[#6C6A66] dark:text-gourmet-muted text-xs mb-1.5">
                        {p.description ?? ""}
                      </p>
                      <span className="text-gourmet-primary font-bold text-sm">
                        {formatPrice(p.price)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className="w-full mt-6 py-3 rounded-lg bg-gourmet-primary/10 hover:bg-gourmet-primary/20 text-gourmet-primary font-bold text-sm transition-colors"
              >
                View All Popular
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
