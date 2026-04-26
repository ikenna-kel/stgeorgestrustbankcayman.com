"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, CreditCard } from "lucide-react";

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
  userId?: { email?: string } | string;
};
type UserOption = { _id: string; email: string };

const TYPE_STYLES: Record<string, string> = {
  savings: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  current: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  fixed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  domiciliary: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ userId: "", accountType: "savings", currency: "USD", initialBalance: "0" });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/accounts"),
      api.get("/api/admin/users?limit=500"),
    ])
      .then(([a, u]) => {
        setAccounts(Array.isArray(a.data) ? a.data : []);
        setUsers(u.data.users ?? []);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  function create(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setCreating(true);
    api
      .post("/api/admin/accounts", {
        userId: form.userId,
        accountType: form.accountType,
        currency: form.currency,
        initialBalance: parseFloat(form.initialBalance) || 0,
      })
      .then((res) => {
        setMessage("Account created successfully.");
        setIsError(false);
        setShowCreate(false);
        setAccounts((a) => [res.data, ...a]);
        setForm({ userId: "", accountType: "savings", currency: "USD", initialBalance: "0" });
      })
      .catch((err) => { setMessage("Error: " + (err.response?.data?.error ?? "Failed")); setIsError(true); })
      .finally(() => setCreating(false));
  }

  const getUserEmail = (userId?: { email?: string } | string) => {
    if (!userId) return "—";
    if (typeof userId === "object") return userId.email ?? "—";
    return userId;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Accounts</h1>
          <p className="text-slate-500 text-sm">{accounts.length} accounts on record</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all
            ${showCreate
              ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
              : "bg-blue-600 hover:bg-blue-500 text-white"}`}
        >
          {showCreate ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Create Account</>}
        </button>
      </div>

      {message && (
        <div className={`flex items-start gap-3 rounded-2xl px-5 py-3 border ${isError
          ? "bg-red-500/10 border-red-500/20 text-red-300"
          : "bg-green-500/10 border-green-500/20 text-green-300"}`}>
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isError ? "bg-red-400" : "bg-green-400"}`} />
          <p className="text-sm">{message}</p>
        </div>
      )}

      {/* Create form */}
      {showCreate && (
        <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6">
          <h2 className="text-sm font-semibold text-white mb-5 flex items-center gap-2">
            <CreditCard size={15} className="text-blue-400" />
            New Account
          </h2>
          <form onSubmit={create} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Assign To User</label>
              <select
                required
                value={form.userId}
                onChange={(e) => setForm((f) => ({ ...f, userId: e.target.value }))}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="" className="bg-slate-800">Select user…</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id} className="bg-slate-800">{u.email}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Account Type</label>
              <select
                value={form.accountType}
                onChange={(e) => setForm((f) => ({ ...f, accountType: e.target.value }))}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              >
                <option value="savings" className="bg-slate-800">Savings</option>
                <option value="current" className="bg-slate-800">Current</option>
                <option value="fixed" className="bg-slate-800">Fixed</option>
                <option value="domiciliary" className="bg-slate-800">Domiciliary</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Currency</label>
              <input
                placeholder="USD"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Initial Balance</label>
              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={form.initialBalance}
                onChange={(e) => setForm((f) => ({ ...f, initialBalance: e.target.value }))}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all"
              >
                {creating
                  ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Creating…</>
                  : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/60">
                {["Account Number", "Type", "Balance", "Currency", "Owner"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/40">
                    {[...Array(5)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-700/60 rounded animate-pulse w-24" /></td>
                    ))}
                  </tr>
                ))
              ) : accounts.length === 0 ? (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-500">No accounts found</td></tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc._id} className="border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-slate-300">{acc.accountNumber}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize
                        ${TYPE_STYLES[acc.accountType?.toLowerCase()] ?? "bg-slate-700/60 text-slate-400 border-slate-600"}`}>
                        {acc.accountType}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-white">{acc.accountBalance?.toFixed(2)}</td>
                    <td className="px-5 py-4 text-slate-400">{acc.currency}</td>
                    <td className="px-5 py-4 text-slate-400 text-xs">{getUserEmail(acc.userId)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
