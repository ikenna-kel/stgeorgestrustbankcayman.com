"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Search, ChevronRight } from "lucide-react";

type UserRow = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
};

type UserSelectorProps = {
  onSelect: (userId: string, userName: string, userEmail: string) => void;
};

export default function UserSelector({ onSelect }: UserSelectorProps) {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const LIMIT = 15;

  function load() {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });
    if (search) params.set("search", search);
    api
      .get("/api/admin/users?" + params)
      .then((res) => {
        setUsers(res.data.users ?? []);
        setTotal(res.data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, [page, search]);

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-white mb-1">Select Account Holder</h2>
        <p className="text-slate-400 text-sm">Choose the user to deposit funds into</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          placeholder="Search email or name…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
        />
      </div>

      {/* User List */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="divide-y divide-slate-700/40">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="px-5 py-4">
                <div className="h-4 bg-slate-700/60 rounded animate-pulse mb-2 w-32" />
                <div className="h-3 bg-slate-700/60 rounded animate-pulse w-24" />
              </div>
            ))
          ) : users.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-500">No users found</div>
          ) : (
            users.map((u) => (
              <button
                key={u._id}
                onClick={() =>
                  onSelect(u._id, `${u.firstname} ${u.lastname}`, u.email)
                }
                className="w-full text-left px-5 py-4 hover:bg-slate-700/30 transition-colors flex items-center justify-between group"
              >
                <div>
                  <p className="text-white font-medium group-hover:text-blue-400 transition-colors">
                    {u.firstname} {u.lastname}
                  </p>
                  <p className="text-slate-500 text-xs mt-1">{u.email}</p>
                </div>
                <ChevronRight
                  size={18}
                  className="text-slate-500 group-hover:text-blue-400 transition-colors shrink-0"
                />
              </button>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            disabled={page === 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
