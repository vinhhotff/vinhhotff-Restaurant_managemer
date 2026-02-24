"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { MdMap, MdAdd, MdSearch } from "react-icons/md";

type TableItem = {
  id: number;
  name?: string;
  capacity?: number;
  status?: string;
  area?: string;
};

export default function AdminAreasPage() {
  const [tables, setTables] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    api
      .get<TableItem[] | { data: TableItem[] }>("/api/tables")
      .then((res) => {
        if (cancelled) return;
        const data = Array.isArray(res.data) ? res.data : (res.data as { data?: TableItem[] })?.data ?? [];
        setTables(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setTables([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const areas = Array.from(new Set(tables.map((t) => t.area || "Default").filter(Boolean)));
  const filteredAreas = search.trim()
    ? areas.filter((a) => a.toLowerCase().includes(search.trim().toLowerCase()))
    : areas;

  return (
    <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-8">
        <header className="flex flex-wrap justify-between items-end gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] flex items-center gap-2">
              <MdMap className="text-gourmet-primary" />
              Restaurant Areas Configurator
            </h1>
            <p className="text-gourmet-muted text-base font-normal">Configure dining areas and assign tables. (API areas chưa có — đang dùng nhóm từ tables.)</p>
          </div>
          <button type="button" className="flex items-center gap-2 bg-gourmet-primary text-gourmet-bg-dark px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors shadow-lg shadow-gourmet-primary/20">
            <MdAdd className="text-[20px]" />
            Add Area
          </button>
        </header>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gourmet-muted text-[20px]" />
            <input
              type="text"
              placeholder="Search areas, tables..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-[#2A251E] border border-[#e5e5e5] dark:border-[#37322a] text-[#171512] dark:text-white placeholder-gourmet-muted focus:outline-none focus:ring-1 focus:ring-gourmet-primary"
            />
          </div>
        </div>

        <section className="rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-white dark:bg-[#2A251E] overflow-hidden">
          <div className="p-6 border-b border-[#e5e5e5] dark:border-[#37322a]">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Areas</h2>
          </div>
          <div className="p-6">
            {loading ? (
              <p className="text-gourmet-muted">Loading…</p>
            ) : filteredAreas.length === 0 ? (
              <p className="text-gourmet-muted">No areas. Tables can be grouped by area when backend supports it.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAreas.map((area) => {
                  const count = tables.filter((t) => (t.area || "Default") === area).length;
                  return (
                    <div
                      key={area}
                      className="p-4 rounded-xl border border-[#e5e5e5] dark:border-[#37322a] bg-[#f0f0f0] dark:bg-[#201d12] hover:border-gourmet-primary/50 transition-colors"
                    >
                      <h3 className="text-white font-bold">{area}</h3>
                      <p className="text-gourmet-muted text-sm mt-1">{count} table(s)</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
    </div>
  );
}
