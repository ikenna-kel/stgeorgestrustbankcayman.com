'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Landmark, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { LoanRequestReceiptData } from "@/src/receipts/loanRequestReceipt";
import { downloadLoanRequestPdf } from "@/src/receipts/loanRequestReceipt";

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
};

type User = {
  _id: string;
  firstName?: string;
  lastName?: string;
  accounts: Account[];
};

type LoanRecord = {
  _id: string;
  amount: number;
  currency: string;
  status: string;
  interestRate: number;
  termMonths: number;
  createdAt: string;
};

const STATUS_STYLES: Record<string, string> = {
  approved: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function LoansPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");

  const [amount, setAmount] = useState<number>(0);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [termMonths, setTermMonths] = useState<number>(12);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Loan History
  const [loanHistory, setLoanHistory] = useState<LoanRecord[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'request' | 'history'>('request');

  const selectedAccount = useMemo(
    () => accounts.find((a) => a._id === selectedAccountId) ?? null,
    [accounts, selectedAccountId]
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get("/api/me")
      .then((res) => {
        setUser(res.data);
        setAccounts(res.data.accounts ?? []);
        if (res.data.accounts?.[0]?._id) setSelectedAccountId(res.data.accounts[0]._id);
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      });

    // Load loan history
    api.get("/api/loans")
      .then(res => setLoanHistory(Array.isArray(res.data) ? res.data : []))
      .catch(() => { })
      .finally(() => setHistoryLoading(false));
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedAccount) {
      setError("Select an account.");
      return;
    }
    if (amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (interestRate < 0) {
      setError("Interest rate must be 0 or greater.");
      return;
    }
    if (termMonths < 1) {
      setError("Term must be at least 1 month.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/api/loans", {
        accountId: selectedAccount._id,
        amount,
        interestRate,
        termMonths,
        currency: selectedAccount.currency ?? "USD",
      });

      const loan = res.data;
      const pdfData: LoanRequestReceiptData = {
        requestId: loan._id,
        createdAt: loan.createdAt ?? new Date().toISOString(),
        status: loan.status,
        accountNumber: selectedAccount.accountNumber,
        accountType: selectedAccount.accountType,
        amount: loan.amount ?? amount,
        currency: loan.currency ?? selectedAccount.currency ?? "USD",
        interestRate: loan.interestRate ?? interestRate,
        termMonths: loan.termMonths ?? termMonths,
        dueDate: loan.dueDate,
      };

      await downloadLoanRequestPdf(pdfData);
      window.alert("Thanks! We will be connected with you shortly.");

      setAmount(0);
      setInterestRate(0);
      setTermMonths(12);

      // Refresh history
      api.get("/api/loans").then(res => setLoanHistory(Array.isArray(res.data) ? res.data : []));
    } catch (err: any) {
      setError(err?.response?.data?.error ?? "Loan request failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans pb-24">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-b from-emerald-700 to-[#0b0e14] pt-6 pb-6 px-6 rounded-b-[3rem]">

        <div className="flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
            <Landmark size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Loan Center</h1>
          <p className="text-white/70 text-sm max-w-xs">Apply for a loan or view your loan history</p>
        </div>
      </div>

      <div className="px-4 sm:px-6 max-w-5xl mx-auto mt-6 space-y-6">
        {/* Tabs */}
        <div className="flex bg-[#1a1d24] rounded-2xl p-1 border border-slate-800">
          {[
            { id: 'request' as const, label: 'Loan Request', icon: <Landmark size={16} /> },
            { id: 'history' as const, label: 'Loan History', icon: <Clock size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all
                ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-white'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Loan Request Tab */}
        {activeTab === 'request' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <form onSubmit={handleSubmit} className="bg-[#1a1d24] rounded-3xl border border-slate-800 p-6">
              <h2 className="text-lg font-bold mb-5">Apply for a Loan</h2>
              {error ? <p className="mb-4 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">{error}</p> : null}

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Account</label>
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {accounts.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.accountType} • {a.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amount</label>
                  <div className="bg-[#0b0e14] p-3 rounded-xl border border-slate-700 flex items-center gap-2 focus-within:border-blue-500 transition-colors">
                    <span className="text-blue-500 text-xl font-bold">$</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount || ''}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="bg-transparent text-right text-2xl font-black text-white focus:outline-none w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Interest Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={interestRate || ''}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Term (Months)</label>
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={termMonths}
                      onChange={(e) => setTermMonths(Number(e.target.value))}
                      className="w-full bg-[#0b0e14] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Submitting...</> : "Submit Loan Request"}
              </button>
            </form>

            {/* Loan Info Card */}
            <div className="space-y-4">
              <div className="bg-[#1a1d24] rounded-3xl border border-slate-800 p-6">
                <h3 className="font-bold text-sm mb-3">How it works</h3>
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Select your account and fill in the loan details" },
                    { step: "2", text: "Submit your request for review" },
                    { step: "3", text: "Our team will review and process your application" },
                    { step: "4", text: "Approved funds will be credited to your account" },
                  ].map(item => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">{item.step}</div>
                      <p className="text-slate-400 text-sm">{item.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4">
                <p className="text-emerald-400 text-xs leading-relaxed">
                  💡 <strong>Tip:</strong> Loans are processed within 24-48 hours. Keep your email and phone number up to date for faster processing.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loan History Tab */}
        {activeTab === 'history' && (
          <div className="bg-[#1a1d24] rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-700/60">
                    {["Amount", "Rate", "Term", "Status", "Date"].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {historyLoading ? (
                    [...Array(3)].map((_, i) => (
                      <tr key={i} className="border-b border-slate-700/40">
                        {[...Array(5)].map((_, j) => (
                          <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-700/60 rounded animate-pulse w-20" /></td>
                        ))}
                      </tr>
                    ))
                  ) : loanHistory.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-500">
                        No loan history found. Apply for your first loan to get started.
                      </td>
                    </tr>
                  ) : (
                    loanHistory.map(loan => (
                      <tr key={loan._id} className="border-b border-slate-700/40 hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-4 font-semibold text-white">{loan.currency} {loan.amount?.toLocaleString()}</td>
                        <td className="px-5 py-4 text-slate-400">{loan.interestRate}%</td>
                        <td className="px-5 py-4 text-slate-400">{loan.termMonths} months</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize
                            ${STATUS_STYLES[loan.status?.toLowerCase()] ?? "bg-slate-700/60 text-slate-400 border-slate-600"}`}>
                            {loan.status === 'approved' && <CheckCircle2 size={12} />}
                            {loan.status === 'pending' && <Clock size={12} />}
                            {loan.status === 'rejected' && <XCircle size={12} />}
                            {loan.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-slate-400 text-xs">{new Date(loan.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
