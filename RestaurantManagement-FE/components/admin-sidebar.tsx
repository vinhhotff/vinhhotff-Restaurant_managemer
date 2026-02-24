"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  MdDashboard,
  MdCalendarToday,
  MdRestaurantMenu,
  MdGroup,
  MdPerson,
  MdSettings,
  MdTableRestaurant,
  MdMap,
} from "react-icons/md";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: MdDashboard },
  { href: "/admin/reservations", label: "Reservations", icon: MdCalendarToday },
  { href: "/admin/tables", label: "Table Inventory", icon: MdTableRestaurant },
  { href: "/admin/tables/layout", label: "Table Layout", icon: MdTableRestaurant },
  { href: "/admin/menu", label: "Menu", icon: MdRestaurantMenu },
  { href: "/admin/users", label: "Customers", icon: MdPerson },
  { href: "#", label: "Staff", icon: MdGroup },
  { href: "/admin/areas", label: "Areas", icon: MdMap },
  { href: "/admin/settings", label: "Settings", icon: MdSettings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login?redirect=/admin" as import("next").Route);
  };

  return (
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
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href !== "#" && (pathname === href || (href !== "/admin" && pathname.startsWith(href)));
            return (
              <Link
                key={href + label}
                href={href as import("next").Route}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive ? "bg-gourmet-primary/20 text-gourmet-primary" : "text-gourmet-muted hover:bg-[#37342a] hover:text-white"
                }`}
              >
                <Icon className="text-[20px]" />
                <span className={`text-sm ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <button
        type="button"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#37342a] text-white hover:bg-[#4a4639] transition-colors text-sm font-bold"
      >
        <span className="truncate">Đăng xuất</span>
      </button>
    </aside>
  );
}
