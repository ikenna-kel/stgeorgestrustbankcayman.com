"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Users, CreditCard, ArrowLeftRight, TrendingUp, ArrowRight } from "lucide-react";

type Stats = { users?: number; accounts?: number; transactions?: number };

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/api/admin/users?limit=1"),
      api.get("/api/admin/accounts"),
      api.get("/api/admin/transactions?limit=1"),
    ])
      .then(([u, a, t]) => {
        setStats({
          users: u.data.total ?? 0,
          accounts: Array.isArray(a.data) ? a.data.length : (a.data.total ?? 0),
          transactions: t.data.total ?? (Array.isArray(t.data) ? t.data.length : 0),
        });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Users",
      value: stats.users,
      icon: Users,
      href: "/admin/users",
      color: "blue",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "bg-blue-600/20",
    },
    {
      label: "Accounts",
      value: stats.accounts,
      icon: CreditCard,
      href: "/admin/accounts",
      color: "cyan",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      glow: "bg-cyan-600/20",
    },
    {
      label: "Transactions",
      value: stats.transactions,
      icon: ArrowLeftRight,
      href: "/admin/transactions",
      color: "green",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      text: "text-green-400",
      glow: "bg-green-600/20",
    },
  ];

  const quickLinks = [
    { href: "/admin/users", label: "Manage Users", icon: Users },
    { href: "/admin/accounts", label: "Manage Accounts", icon: CreditCard },
    { href: "/admin/transactions", label: "Transactions", icon: ArrowLeftRight },
    { href: "/admin/settings", label: "Site Settings", icon: TrendingUp },
    { href: "/admin/mail", label: "Send Mail", icon: ArrowRight },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-slate-500 text-sm">Welcome back, Admin. Here's what's happening.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon, href, bg, border, text, glow }) => (
          <Link
            key={label}
            href={href}
            className="group relative bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 hover:border-slate-600 transition-all overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${glow} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity rounded-full`} />
            <div className={`w-12 h-12 ${bg} border ${border} rounded-2xl flex items-center justify-center mb-5`}>
              <Icon size={22} className={text} />
            </div>
            <p className="text-3xl font-bold text-white mb-1">
              {loading ? (
                <span className="inline-block w-12 h-7 bg-slate-700/60 rounded animate-pulse" />
              ) : (
                value ?? "—"
              )}
            </p>
            <p className="text-slate-400 text-sm">{label}</p>
            <div className="flex items-center gap-1 mt-3 text-xs text-slate-500 group-hover:text-blue-400 transition-colors">
              View all <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4">Quick actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 bg-slate-800/60 border border-slate-700/60 hover:bg-slate-800 hover:border-slate-600 text-slate-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
