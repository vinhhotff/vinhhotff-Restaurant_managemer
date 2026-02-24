"use client";

import { useState } from "react";
import Link from "next/link";
import { MdSecurity, MdSave, MdAdminPanelSettings, MdAddCircle } from "react-icons/md";

const ROLES = [
  { id: "ROLE_ADMIN", label: "ROLE_ADMIN", desc: "Full system access, user management, and configuration control." },
  { id: "ROLE_MANAGER", label: "ROLE_MANAGER", desc: "Manage reservations, menu, and staff. No system config." },
  { id: "ROLE_SERVER", label: "ROLE_SERVER", desc: "View reservations and tables. Check-in guests." },
  { id: "ROLE_CUSTOMER", label: "ROLE_CUSTOMER", desc: "Book reservations and view own history." },
];

export default function AdminRolesPage() {
  const [selectedRole, setSelectedRole] = useState(ROLES[0].id);

  return (
    <>
        <header className="h-20 border-b border-[#e5e5e5] dark:border-[#37322a] bg-white/80 dark:bg-[#201b12]/80 backdrop-blur-md sticky top-0 z-10 px-6 md:px-10 flex items-center justify-between shrink-0 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Roles & Permissions Config</h2>
            <p className="text-gourmet-muted text-sm">Define access levels and security policies for your team.</p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-[#e5e5e5] dark:border-[#37322a] text-[#171512] dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-white/5 transition-colors text-sm font-medium">
              Discard Changes
            </button>
            <button type="button" className="px-6 py-2 rounded-lg bg-gourmet-primary hover:bg-yellow-500 text-gourmet-bg-dark font-bold shadow-[0_0_15px_rgba(220,179,46,0.3)] transition-all text-sm flex items-center gap-2">
              <MdSave className="text-lg" />
              Save Changes
            </button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <div className="w-80 border-r border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E]/30 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-6 pb-2">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-sm font-bold uppercase tracking-wider">Defined Roles</h3>
                <button type="button" className="text-gourmet-primary hover:text-white transition-colors p-1 rounded hover:bg-white/10" title="Add New Role">
                  <MdAddCircle className="text-xl" />
                </button>
              </div>
              <div className="flex flex-col gap-3">
                {ROLES.map((role) => (
                  <label key={role.id} className="group cursor-pointer relative block">
                    <input
                      type="radio"
                      name="role_select"
                      checked={selectedRole === role.id}
                      onChange={() => setSelectedRole(role.id)}
                      className="peer sr-only"
                    />
                    <div
                      className={`relative flex flex-col gap-1 p-4 rounded-xl border-2 transition-all ${
                        selectedRole === role.id
                          ? "border-gourmet-primary bg-gourmet-primary/10"
                          : "border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] hover:border-[#e5e5e5] dark:border-[#37322a]/80 hover:bg-[#f0f0f0] dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          <MdSecurity className={selectedRole === role.id ? "text-gourmet-primary" : "text-gourmet-muted"} />
                          <span className="text-white font-bold text-sm">{role.label}</span>
                        </div>
                        {selectedRole === role.id && (
                          <span className="h-2 w-2 rounded-full bg-gourmet-primary shadow-[0_0_8px_rgba(220,179,46,0.8)]" />
                        )}
                      </div>
                      <p className="text-gourmet-muted text-xs leading-relaxed mt-1">{role.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl">
              <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
                <MdAdminPanelSettings className="text-gourmet-primary" />
                Permissions for {selectedRole}
              </h3>
              <p className="text-gourmet-muted text-sm mb-6">API roles & permissions chưa có. Cấu hình sẽ có hiệu lực khi backend hỗ trợ.</p>
              <div className="rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] p-6 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-[#e5e5e5] dark:border-[#37322a] text-gourmet-primary focus:ring-gourmet-primary" />
                  <span className="text-white text-sm">View Dashboard</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-[#e5e5e5] dark:border-[#37322a] text-gourmet-primary focus:ring-gourmet-primary" />
                  <span className="text-white text-sm">Manage Reservations</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#e5e5e5] dark:border-[#37322a] text-gourmet-primary focus:ring-gourmet-primary" />
                  <span className="text-white text-sm">Manage Users</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-[#e5e5e5] dark:border-[#37322a] text-gourmet-primary focus:ring-gourmet-primary" />
                  <span className="text-white text-sm">System Settings</span>
                </label>
              </div>
            </div>
          </div>
        </div>
    </>
  );
}
