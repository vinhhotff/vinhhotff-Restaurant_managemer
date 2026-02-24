"use client";

import Link from "next/link";

export default function AdminSettingsPage() {
  return (
        <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
          <div className="flex flex-wrap gap-2 text-sm">
            <Link href="/admin" className="text-gourmet-muted font-medium hover:text-white">Home</Link>
            <span className="text-gourmet-muted font-medium">/</span>
            <Link href="/admin/settings" className="text-gourmet-muted font-medium hover:text-white">Settings</Link>
            <span className="text-gourmet-muted font-medium">/</span>
            <span className="text-gourmet-primary font-medium">Restaurant Profile</span>
          </div>
          <div className="flex flex-col gap-2">
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em]">Restaurant Profile</h1>
            <p className="text-gourmet-muted text-base font-normal">Manage your restaurant&apos;s public information, contact details, and operating hours.</p>
          </div>

          <section className="flex flex-col gap-4">
            <h2 className="text-white text-[22px] font-bold leading-tight border-b border-[#37342a] pb-2">General Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">Restaurant Name</span>
                <input
                  type="text"
                  placeholder="Enter restaurant name"
                  defaultValue="Bistro Noir"
                  className="w-full rounded-lg bg-[#f8f8f8] dark:bg-[#26241d] border border-[#e5e5e5] dark:border-[#514d3d] text-[#171512] dark:text-white px-4 py-3 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary placeholder-gourmet-muted"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">Contact Email</span>
                <input
                  type="email"
                  placeholder="email@address.com"
                  defaultValue="contact@bistronoir.com"
                  className="w-full rounded-lg bg-[#f8f8f8] dark:bg-[#26241d] border border-[#e5e5e5] dark:border-[#514d3d] text-[#171512] dark:text-white px-4 py-3 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary placeholder-gourmet-muted"
                />
              </label>
              <label className="flex flex-col gap-2 md:col-span-2">
                <span className="text-white text-sm font-medium">Description</span>
                <textarea
                  placeholder="Briefly describe your restaurant..."
                  rows={3}
                  defaultValue="Located in the heart of the city, Bistro Noir offers an exquisite dining experience with a modern twist on classic French cuisine."
                  className="w-full rounded-lg bg-[#f8f8f8] dark:bg-[#26241d] border border-[#e5e5e5] dark:border-[#514d3d] text-[#171512] dark:text-white px-4 py-3 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary placeholder-gourmet-muted resize-none"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">Phone Number</span>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  defaultValue="+1 (555) 123-4567"
                  className="w-full rounded-lg bg-[#f8f8f8] dark:bg-[#26241d] border border-[#e5e5e5] dark:border-[#514d3d] text-[#171512] dark:text-white px-4 py-3 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary placeholder-gourmet-muted"
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="text-white text-sm font-medium">Website URL</span>
                <input
                  type="url"
                  placeholder="https://"
                  className="w-full rounded-lg bg-[#f8f8f8] dark:bg-[#26241d] border border-[#e5e5e5] dark:border-[#514d3d] text-[#171512] dark:text-white px-4 py-3 focus:ring-1 focus:ring-gourmet-primary focus:border-gourmet-primary placeholder-gourmet-muted"
                />
              </label>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <h2 className="text-white text-[22px] font-bold leading-tight border-b border-[#37342a] pb-2">Operating Hours</h2>
            <p className="text-gourmet-muted text-sm">Configure opening hours per day. (API chưa có)</p>
          </section>

          <div className="flex gap-3">
            <button type="button" className="px-4 py-2 rounded-lg border border-[#e5e5e5] dark:border-[#37322a] text-[#171512] dark:text-white hover:bg-[#f0f0f0] dark:hover:bg-[#37342a] text-sm font-medium transition-colors">
              Discard Changes
            </button>
            <button type="button" className="px-6 py-2 rounded-lg bg-gourmet-primary text-gourmet-bg-dark font-bold hover:bg-yellow-400 text-sm transition-colors">
              Save Changes
            </button>
          </div>
        </div>
  );
}
