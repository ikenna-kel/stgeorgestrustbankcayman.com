"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, BanknoteX, Gift, Percent, CreditCard, TrendingUp, TrendingDown, DollarSign, Shield, Clock, Send, Globe, ArrowUpRight, LifeBuoy, MessageCircle, Phone } from "lucide-react"
import Link from "next/link";
import { api } from "@/lib/api";
import FinanacialServiceCard from "@/src/components/financailservice.card";
import EmblaCarousel from "@/src/carosel/EmblaCarousel";
import ClientHead from "./(components)/header";
import { Options } from "./(components)/options";
import AddButton from "./(components)/addButton";
import { AccountHealthCard } from "./(components)/AccountHealthCard";
import { MonthlySummaryCard } from "./(components)/MonthlySummaryCard";
import { RecentActivity } from "./(components)/RecentActivity";
import { Achievements } from "./(components)/Achievements";
import { HelpSection } from "./(components)/HelpSection";
import { SupportBanner } from "./(components)/SupportBanner";

type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  accounts: { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string }[];
  cards: { _id: string; type: string; balance: number; lastFourDigits: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);


  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.push("/login");
      return;
    }
    api
      .get("/api/me")
      .then((res) => { setUser(res.data) })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);


  // Demo backend-driven metrics (replace with real API data)
  const [healthPercent, setHealthPercent] = useState<number>(73);
  const [monthlyTotals, setMonthlyTotals] = useState<{ totalIn: number; totalOut: number; currency?: string }>({
    totalIn: 4520.5,
    totalOut: 1389.25,
    currency: "USD",
  });
  const [history, setHistory] = useState<Array<{ id: string; date: string; desc: string; amount: number }>>([
    { id: "1", date: "2026-02-12", desc: "Salary", amount: 3000 },
    { id: "2", date: "2026-02-14", desc: "Coffee Shop", amount: -4.5 },
    { id: "3", date: "2026-02-18", desc: "Groceries", amount: -86.75 },
    { id: "4", date: "2026-02-21", desc: "Freelance", amount: 800 },
    { id: "5", date: "2026-02-23", desc: "Electricity Bill", amount: -120 },
  ]);

  const slides =
    user?.accounts.map((res, index) => <div key={index} className="relative w-full max-w-104 sm:max-w-lg md:max-w-xl lg:max-w-160 h-52 sm:h-56 rounded-2xl overflow-hidden shadow-2xl mx-auto">

      {/* Base Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-[#0ea5e9] to-[#1e3a8a]" />

      {/* Top Right Bubble */}
      <div className="absolute -top-5 -right-5 w-40 h-40 rounded-full 
                      bg-linear-to-br from-indigo-950/70 to-white/5 
                      opacity-60 animate-pulse" />

      {/* Bottom Left Bubble */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full 
                      bg-linear-to-tr from-blue-600/70 to-transparent animate-pulse
                      " />

      {/* Content */}
      <div className="relative z-10 p-6 text-white flex flex-col justify-between h-full">

        {/* Top */}
        <div className="flex justify-between">
          <div>
            <p className="text-xs tracking-widest opacity-80">
              ST. GEORGES TRUST BANK
            </p>
            <p className="text-xs opacity-60">{user.firstName}</p>
          </div>

          <div className="text-right">
            <p className="text-xs opacity-70">{res.accountType.toLocaleUpperCase()} Account</p>
            <p className="text-sm font-semibold">{res.accountNumber}</p>
          </div>
        </div>

        {/* Balance */}
        <div className="text-center">
          <p className="text-xs opacity-70">Available Balance</p>
          <h2 className="text-3xl font-bold tracking-wide">
            {formatCurrency(res.accountBalance)}
          </h2>
        </div>

        {/* Bottom */}
        <div className="flex justify-between items-center">

          <span className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
            <span className="w-2 h-2 bg-green-400 rounded-full" />
            Active
          </span>

          <p className=" text-[10px] opacity-60">
            Last updated: {new Date(Date.now()).getUTCFullYear()}
          </p>
        </div>


      </div>
    </div>
    );




  function handleLogout() {
    api.post("/api/auth/logout").catch(() => { }).finally(() => {
      localStorage.removeItem("token");
      router.push("/");
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <p className="text-zinc-600 dark:text-zinc-400">Loading…</p>
      </div>
    );
  }
  if (!user) return null;

  const monthName = new Date().toLocaleString(undefined, { month: "long" });
  const totalBalance = user.accounts.reduce((sum, a) => sum + a.accountBalance, 0);

  function formatCurrency(value: number) {
    try {
      const code = monthlyTotals.currency || "USD";
      return new Intl.NumberFormat(undefined, { style: "currency", currency: code }).format(value);
    } catch (e) {
      return `${monthlyTotals.currency || "$"}${value.toFixed(2)}`;
    }
  }

  return (
    <div className="relative min-h-screen 
      bg-[linear-gradient(135deg,#0b1f2a_0%,#123a5a_30%,#1f6fa9_50%,#123a5a_70%,#0b1f2a_100%)] 
      text-white overflow-hidden">

      {/* Soft bloom overlays */}
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.08),transparent_40%)]" />
      <div className="absolute inset-0 
        bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.05),transparent_45%)]" />

      <div className="relative z-10 mx-auto w-full max-w-[1600px]">

        {/* ─── Top Stats Cards (Desktop Only) ─── */}
        <div className="hidden lg:grid grid-cols-4 gap-4 px-4 sm:px-6 lg:px-8 xl:px-10 pt-6">
          {[
            { label: "Current Balance", value: formatCurrency(totalBalance), icon: DollarSign, color: "from-blue-600 to-blue-700", iconBg: "bg-blue-500/20" },
            { label: "Total Monthly Income", value: formatCurrency(monthlyTotals.totalIn), icon: TrendingUp, color: "from-emerald-600 to-emerald-700", iconBg: "bg-emerald-500/20" },
            { label: "Total Monthly Outgoing", value: formatCurrency(monthlyTotals.totalOut), icon: TrendingDown, color: "from-rose-600 to-rose-700", iconBg: "bg-rose-500/20" },
            { label: "Transaction Limit", value: formatCurrency(500000), icon: Shield, color: "from-purple-600 to-purple-700", iconBg: "bg-purple-500/20" },
          ].map(({ label, value, icon: Icon, color, iconBg }) => (
            <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 border border-white/10 shadow-lg relative overflow-hidden group hover:scale-[1.02] transition-transform`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 group-hover:bg-white/10 transition-colors" />
              <div className="flex items-center gap-3 mb-3">
                <div className={`${iconBg} p-2 rounded-xl`}>
                  <Icon size={18} className="text-white" />
                </div>
                <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{label}</p>
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        {/* ─── Main Grid: Left Content + Right Sidebar ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8 xl:px-10">

          {/* ─── LEFT COLUMN (spans 2) ─── */}
          <div className="lg:col-span-2">
            <div className="pb-14 md:pb-16 bg-linear-to-br from-[#0b1120] via-[#222066] to-[#151342] rounded-b-3xl lg:rounded-3xl lg:mt-6">
              <div className="px-4 sm:px-6 pt-4 md:pt-6">
                <div className="mt-2 md:mt-3">
                  <EmblaCarousel slides={slides} />
                </div>
                <div className="mt-5 md:mt-6">
                  <Options />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-[#23386b] via-[#23225a] to-[#151342] px-4 sm:px-6 pb-12 md:pb-16 rounded-3xl mt-6">
              <section className="pt-6 md:pt-8">
                <div className="flex justify-between items-center py-4 md:py-5">
                  <p className="text-gray-200 text-sm md:text-base font-bold">Quick Transfer</p>
                  <Link className="text-gray-200 font-thin text-xs md:text-sm flex items-center" href={""}>
                    <p className="">View All</p>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>

                <AddButton />


                <div className="flex justify-between items-center mt-8 md:mt-10">
                  <p className="text-gray-200 text-sm md:text-base font-bold">Your Active Cards</p>
                  <Link className="text-gray-200 font-thin text-xs md:text-sm flex items-center" href={""}>
                    <p className="">Manage</p>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>

                <div className="backdrop-blur-md rounded-xl shadow-lg p-3 md:p-5 mt-4 md:mt-5 border border-blue-900/50 max-w-4xl">

                  <div className="flex flex-col justify-between">

                    {/* Debit Card with Flip Animation */}


                    <div className="relative w-full max-w-104 md:max-w-120 h-48 md:h-52 perspective-distant group cursor-pointer select-none"
                      tabIndex={0} // allow keyboard focus for accessibility
                    >
                      <div
                        tabIndex={0}
                        role="button"
                        aria-label="Flip card"
                        onClick={() => setFlipped(prev => !prev)}
                        onKeyDown={e => {
                          if (e.key === "Enter" || e.key === " ") setFlipped(prev => !prev);
                        }}
                        className={`
              absolute inset-0 transition-transform duration-700 transform-3d
              ${flipped ? "transform-[rotateY(180deg)]" : ""}
              group-hover:shadow-[0_10px_52px_5px_rgba(11,45,114,0.29)]
              group-hover:saturate-150
            `}
                      >
                        {/* Card Front */}
                        <div className={`
            absolute inset-0 rounded-xl
            flex flex-col justify-between
            bg-linear-to-tr from-(--color-primary) via-(--color-secondary) to-(--color-primary-300)
            p-3 transition-all duration-300
            before:absolute before:inset-0 before:rounded-3xl before:pointer-events-none
            before:bg-[conic-gradient(from_120deg_at_60%_50%,rgba(255,255,255,0.34)_25%,transparent_75%)]
            group-hover:before:opacity-80 group-hover:before:blur-[2px] before:transition-all before:duration-300
            backface-hidden
          `}>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-white font-semibold tracking-wide">
                              <p className="font-bold">St. Georges</p>
                              <p className="">Trust Banking</p>
                            </span>
                            <span className="text-lg text-white/70 font-extrabold">⋆⋆⋆⋆</span>
                          </div>
                          <div className="mt-6">
                            <span className="block text-gray-100  font-mono tracking-widest select-text text-sm">
                              4321&nbsp;****
                              ****&nbsp;1234
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-0 text-sm">
                            <div>
                              <p className="text-sm text-zinc-200/80 mb-1">Card Holder</p>
                              <p className="font-medium text-white">{user.firstName} {user.lastName}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-zinc-200/80 mb-1">Valid Thru</p>
                              <p className="font-medium text-white">12/29</p>
                            </div>
                          </div>
                        </div>
                        {/* Card Back */}
                        <div className={`
            absolute inset-0 rounded-xl shadow-xl flex flex-col
            bg-linear-to-bl from-(--color-accent-light) via-(--color-secondary) to-(--color-primary) 
            p-7 transform-[rotateY(180deg)] transition-all duration-300
            backface-hidden
          `}>
                          <div className="w-full h-8 bg-zinc-900 rounded-lg mb-3" />
                          <div className="flex justify-between items-center mt-4">
                            <div>
                              <p className="uppercase text-xs text-zinc-900/40 font-bold">Customer Service</p>
                              <p className="text-zinc-900 text-sm">1-800-000-0000</p>
                            </div>
                            <div className="flex flex-col items-end">
                              <p className="uppercase text-xs text-zinc-900/40 font-bold">CVV</p>
                              <div className="w-12 h-6 bg-white flex items-center justify-center rounded mt-1">
                                <span className="text-zinc-900 font-semibold select-text">258</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex-1 flex items-end">
                            <span className="text-xs text-zinc-800/40">Debit Card · St. Georges Trust Bank</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between py-2 px-2">
                      <p className="text-xs text-gray-100">American Express Card</p>
                      <p className="text-xs font-semibold text-gray-200">USD 0.00</p>
                    </div>

                    <button className="w-full py-3 bg-linear-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold hover:opacity-90 transition-opacity">
                      View All Cards
                    </button>
                  </div>
                </div>
              </section>

              <section className="pt-8 md:pt-10">
                <div className="flex justify-between items-center py-4 md:py-5">
                  <p className="text-gray-200 font-semibold text-xs md:text-sm">Financial Services</p>
                  <Link className="text-gray-200 font-thin text-xs md:text-sm flex items-center" href={""}>
                    <p className="">View All</p>
                    <ChevronRight className="size-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
                  <FinanacialServiceCard
                    title="Loans"
                    statusLabel="Available"
                    description="Quick approval process"
                    href="/loans"
                    Icon={BanknoteX}
                  />
                  <FinanacialServiceCard
                    title="Grants"
                    statusLabel="Available"
                    description="Simple application, fast response"
                    href="/grants"
                    Icon={Gift}
                  />
                  <FinanacialServiceCard
                    title="Tax refunds"
                    statusLabel="Available"
                    description="Apply and track your refund request"
                    href="/tax-refunds"
                    Icon={Percent}
                  />
                  <FinanacialServiceCard
                    title="Virtual cards"
                    statusLabel="Available"
                    description="Get a virtual card for online purchases"
                    href="/virtual-cards"
                    Icon={CreditCard}
                  />
                </div>
              </section>

              <div className="pt-8 md:pt-10 text-white font-sans flex flex-col gap-4 md:gap-5">
                <AccountHealthCard />
                <MonthlySummaryCard />
                <RecentActivity userId={user._id} />
              </div>

              <section className="pt-8 md:pt-10">
                <Achievements />
                <HelpSection />
                <SupportBanner />
              </section>
            </div>
          </div>

          {/* ─── RIGHT COLUMN (spans 1, desktop only) ─── */}
          <div className="hidden lg:flex flex-col gap-5 mt-6">

            {/* Account Statistics */}
            <div className="bg-[#0F172A] border border-slate-700/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Shield size={16} className="text-blue-400" />
                Account Statistics
              </h3>
              <div className="space-y-4">
                {[
                  { label: "Transaction Limit", value: formatCurrency(500000), color: "text-blue-400", barColor: "bg-blue-500", barWidth: "75%" },
                  { label: "Pending Transactions", value: "0", color: "text-amber-400", barColor: "bg-amber-500", barWidth: "0%" },
                  { label: "Transaction Volume", value: formatCurrency(monthlyTotals.totalIn + monthlyTotals.totalOut), color: "text-emerald-400", barColor: "bg-emerald-500", barWidth: "45%" },
                ].map(({ label, value, color, barColor, barWidth }) => (
                  <div key={label}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-slate-400">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>{value}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: barWidth }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Transfer */}
            <div className="bg-[#0F172A] border border-slate-700/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <Send size={16} className="text-blue-400" />
                Quick Transfer
              </h3>
              <div className="space-y-3">
                <Link
                  href="/do-transfer"
                  className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 rounded-xl p-4 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                      <Send size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Local Transfer</p>
                      <p className="text-slate-500 text-xs">Send to local accounts</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-500 group-hover:text-blue-400 transition-colors" />
                </Link>
                <Link
                  href="/international-transfer"
                  className="flex items-center justify-between bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 rounded-xl p-4 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-indigo-500/20 p-2 rounded-lg">
                      <Globe size={16} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">International Transfer</p>
                      <p className="text-slate-500 text-xs">Wire, PayPal, Crypto & more</p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                </Link>
              </div>
            </div>

            {/* Help Desk */}
            <div className="bg-[#0F172A] border border-slate-700/60 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <LifeBuoy size={16} className="text-blue-400" />
                Help Desk
              </h3>
              <p className="text-slate-400 text-xs mb-4">Need assistance? Our support team is available 24/7.</p>
              <div className="space-y-3">
                <Link
                  href="/support-ticket"
                  className="flex items-center gap-3 bg-blue-600/10 border border-blue-500/20 rounded-xl p-3 hover:bg-blue-600/20 transition-colors"
                >
                  <MessageCircle size={16} className="text-blue-400" />
                  <span className="text-blue-400 text-sm font-semibold">Open Support Ticket</span>
                </Link>
                <div className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-3">
                  <Phone size={16} className="text-slate-500" />
                  <div>
                    <p className="text-slate-400 text-xs">Call Support</p>
                    <p className="text-white text-sm font-semibold">1-800-000-0000</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
