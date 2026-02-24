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
import { ThemeToggle } from "@/components/theme-toggle";

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
    <aside className="flex h-full w-64 flex-col justify-between border-r border-[#e5e5e5] dark:border-[#3e3b30] bg-white dark:bg-[#171612] flex-shrink-0 transition-colors duration-200">
      {/* Logo + Nav */}
      <div className="flex flex-col gap-6 p-4 overflow-y-auto min-h-0">
        <div className="flex items-center gap-3 px-2 shrink-0">
          <div className="size-10 rounded-full border border-[#e5e5e5] dark:border-[#3e3b30] bg-gourmet-primary/10 flex items-center justify-center shrink-0">
            <span className="text-gourmet-primary font-bold">G</span>
          </div>
          <div className="flex flex-col min-w-0">
            <h1 className="text-[#171512] dark:text-white text-base font-bold leading-tight truncate">GourmetAdmin</h1>
            <p className="text-gourmet-muted text-xs font-normal leading-tight">Manager Dashboard</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1" aria-label="Admin menu">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = href !== "#" && (pathname === href || (href !== "/admin" && pathname.startsWith(href)));
            const isDisabled = href === "#";
            const content = (
              <>
                <Icon className="text-[20px] shrink-0" />
                <span className={`text-sm truncate ${isActive ? "font-semibold" : "font-medium"}`}>{label}</span>
              </>
            );
            const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors";
            const activeClass = "bg-gourmet-primary/20 text-gourmet-primary border-l-4 border-l-gourmet-primary";
            const inactiveClass = "text-gourmet-muted hover:bg-[#f0f0f0] dark:hover:bg-[#37342a] hover:text-[#171512] dark:hover:text-white border-l-4 border-l-transparent";
            const disabledClass = "opacity-60 cursor-not-allowed text-gourmet-muted";

            if (isDisabled) {
              return (
                <span
                  key={href + label}
                  title="Sắp ra mắt"
                  className={`${baseClass} ${inactiveClass} ${disabledClass}`}
                  aria-disabled="true"
                >
                  {content}
                </span>
              );
            }
            return (
              <Link
                key={href + label}
                href={href as import("next").Route}
                className={`${baseClass} ${isActive ? activeClass : inactiveClass}`}
                aria-current={isActive ? "page" : undefined}
              >
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Theme + Logout */}
      <div className="p-4 pt-0 flex flex-col gap-3 shrink-0 border-t border-[#e5e5e5] dark:border-[#3e3b30]">
        <ThemeToggle placement="sidebar" />
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-lg h-10 px-4 bg-[#e5e5e5] dark:bg-[#37342a] text-[#171512] dark:text-white hover:bg-[#d0d0d0] dark:hover:bg-[#4a4639] transition-colors text-sm font-bold"
        >
          <span className="truncate">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
