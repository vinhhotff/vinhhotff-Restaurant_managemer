"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { AdminSidebar } from "@/components/admin-sidebar";
import { MdAdd, MdSearch, MdEdit, MdDelete, MdOpenInNew } from "react-icons/md";

type UserItem = {
  id: number;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
};

export default function AdminUsersPage() {
  const [list, setList] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get<{ data: UserItem[] } | UserItem[]>("/api/users")
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : (res.data as { data?: UserItem[] })?.data ?? [];
        setList(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setList([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = list.filter((u) => {
    const q = search.trim().toLowerCase();
    if (q && !(u.fullName ?? "").toLowerCase().includes(q) && !(u.email ?? "").toLowerCase().includes(q)) return false;
    if (roleFilter && (u.role ?? "").toLowerCase() !== roleFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-hidden bg-gourmet-bg-dark font-display text-slate-900 dark:text-white">
      <AdminSidebar />
      <main className="flex-1 flex flex-col h-full overflow-y-auto p-6 md:p-10 max-w-[1200px] w-full mx-auto gap-6">
        <div className="flex flex-wrap gap-2 items-center text-sm">
          <Link href="/admin" className="text-gourmet-muted font-medium hover:text-gourmet-primary transition-colors">Dashboard</Link>
          <span className="text-gourmet-muted">›</span>
          <Link href="/admin/settings" className="text-gourmet-muted font-medium hover:text-gourmet-primary transition-colors">Settings</Link>
          <span className="text-gourmet-muted">›</span>
          <span className="text-white font-medium">User Directory</span>
        </div>
        <header className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-white text-4xl font-extrabold leading-tight tracking-[-0.033em]">User Directory</h1>
            <p className="text-gourmet-muted text-base font-normal max-w-2xl">Manage staff access, roles, and configurations. View active sessions and manage permissions.</p>
          </div>
          <button type="button" className="flex items-center justify-center rounded-lg h-12 px-6 bg-gourmet-primary hover:bg-yellow-400 text-gourmet-bg-dark text-sm font-bold transition-colors shadow-lg shadow-gourmet-primary/10">
            <MdAdd className="mr-2 text-lg" />
            Add New User
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-4 w-full">
          <div className="flex flex-col flex-1 min-w-[240px]">
            <label className="text-white text-sm font-medium pb-2">Search Users</label>
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gourmet-muted text-[20px]" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-gourmet-primary/50 border border-[#514d3d] bg-[#2a271d] focus:border-gourmet-primary h-12 pl-11 pr-4 text-base placeholder-gourmet-muted"
              />
            </div>
          </div>
          <div className="flex flex-col w-full md:w-48">
            <label className="text-white text-sm font-medium pb-2">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-lg text-white focus:outline-0 focus:ring-2 focus:ring-gourmet-primary/50 border border-[#514d3d] bg-[#2a271d] focus:border-gourmet-primary h-12 px-4 text-base appearance-none cursor-pointer"
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="manager">Manager</option>
              <option value="server">Server</option>
              <option value="customer">Customer</option>
            </select>
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-[#514d3d] bg-[#2a271d] shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#201d12] border-b border-[#514d3d]">
                  <th className="px-6 py-4 text-gourmet-muted text-xs font-bold uppercase tracking-wider">User Profile</th>
                  <th className="px-6 py-4 text-gourmet-muted text-xs font-bold uppercase tracking-wider hidden md:table-cell">Contact</th>
                  <th className="px-6 py-4 text-gourmet-muted text-xs font-bold uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-gourmet-muted text-xs font-bold uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-gourmet-muted text-xs font-bold uppercase tracking-wider text-right hidden lg:table-cell">Shortcuts</th>
                  <th className="px-6 py-4 text-gourmet-muted text-xs font-bold uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#514d3d]">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-gourmet-muted">Loading…</td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-4 text-gourmet-muted">No users match.</td></tr>
                ) : (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-[#322f25] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gourmet-primary/20 border-2 border-[#514d3d] flex items-center justify-center text-gourmet-primary font-bold">
                            {(u.fullName ?? "?").charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white text-sm font-bold">{u.fullName ?? "—"}</span>
                            <span className="text-gourmet-muted text-xs">{u.email ?? "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell text-gourmet-muted text-sm">{u.phone ?? "—"}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gourmet-primary/20 text-gourmet-primary border border-gourmet-primary/20">
                          {u.role ?? "Customer"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                          {u.status ?? "Verified"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right hidden lg:table-cell">
                        <Link href={`/users/${u.id}`} className="text-gourmet-primary text-sm font-medium hover:underline flex items-center justify-end gap-1">
                          View Reservations <MdOpenInNew className="text-[16px]" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/users/${u.id}`} className="text-gourmet-muted hover:text-white p-2 rounded-full hover:bg-[#514d3d]/50 transition-colors" title="Edit User">
                            <MdEdit className="text-[20px]" />
                          </Link>
                          <button type="button" className="text-gourmet-muted hover:text-red-400 p-2 rounded-full hover:bg-red-900/20 transition-colors" title="Delete User">
                            <MdDelete className="text-[20px]" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#514d3d]">
            <p className="text-gourmet-muted text-sm font-medium">
              Showing <span className="text-white">1</span> to <span className="text-white">{filtered.length}</span> of <span className="text-white">{filtered.length}</span> users
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
