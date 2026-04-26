"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { api } from "@/lib/api";
import { ArrowLeft, ArrowRight, Send, CheckCircle2, ChevronDown } from "lucide-react";
import TransferReceiptModal from "@/src/receipts/TransferReceiptModal";
import { TransferReceiptData } from "@/src/receipts/transferReceipt";

type Account = { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string };

export default function TransferPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState("");
  const [toAccountNumber, setToAccountNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<TransferReceiptData | null>(null);
  const router = useRouter();

  useEffect(() => {
    api.get("/api/accounts").then((res) => {
      const data = Array.isArray(res.data) ? res.data : [];
      setAccounts(data);
      if (data.length > 0) setFromAccount(data[0].accountNumber);
    }).catch(() => { });
  }, []);

  const selectedAcc = accounts.find(a => a.accountNumber === fromAccount);
  const availableBalance = selectedAcc?.accountBalance ?? 0;
  const currency = selectedAcc?.currency ?? "USD";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!localStorage.getItem("token")) { router.push("/login"); return; }
    if (parseFloat(amount) > availableBalance) { setError("Insufficient balance"); return; }
    setLoading(true);
    try {
      const transferAmount = parseFloat(amount);
      const tx = await api.post("/api/transfer", {
        fromAccountNumber: fromAccount,
        toAccountNumber,
        amount: transferAmount,
        type: "local",
        kind: "internal",
        description: note,
      });
      setReceipt({
        transactionId: tx.data?._id ?? `tx-${Date.now()}`,
        createdAt: tx.data?.date ?? new Date().toISOString(),
        fromAccount,
        toAccount: toAccountNumber,
        amount: transferAmount,
        currency,
        transferType: "local",
        transferKind: "internal",
        note,
        status: tx.data?.status ?? "completed",
      });
      setToAccountNumber("");
      setAmount("");
      setNote("");
    } catch (err) {
      const msg = axios.isAxiosError(err) && err.response?.data?.error ? err.response.data.error : "Transfer failed";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] text-white font-sans pb-10">
      {/* Header */}
      <div className="relative overflow-hidden bg-linear-to-b from-blue-700 to-[#0b0e14] pt-6 pb-12 px-6 rounded-b-[3rem]">
        <button onClick={() => router.back()} className="bg-white/10 p-2 rounded-xl mb-6 backdrop-blur-md hover:bg-white/20 transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
            <Send size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Local Transfer</h1>
          <p className="text-white/70 text-sm">Send money to any account instantly</p>
        </div>
      </div>

      <div className="px-6 mt-6 pb-24 space-y-5">
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
            <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* From account */}
          <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">From Account</label>
            <div className="relative">
              <select
                value={fromAccount}
                onChange={e => setFromAccount(e.target.value)}
                className="w-full bg-[#0b0e14] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
              >
                {accounts.map(a => (
                  <option key={a._id} value={a.accountNumber} className="bg-[#1a1d24]">
                    {a.accountType.charAt(0).toUpperCase() + a.accountType.slice(1)} — {a.accountNumber} ({a.currency} {a.accountBalance.toLocaleString()})
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
            </div>
            {selectedAcc && (
              <p className="text-xs text-slate-500 mt-2">Available: <span className="text-white font-semibold">{currency} {availableBalance.toLocaleString()}</span></p>
            )}
          </div>

          {/* To account */}
          <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">To Account Number</label>
            <input
              type="text"
              placeholder="Enter recipient account number"
              value={toAccountNumber}
              onChange={e => setToAccountNumber(e.target.value)}
              required
              className="w-full bg-[#0b0e14] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Amount */}
          <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Amount</label>
            <div className="bg-[#0b0e14] p-4 rounded-2xl border border-gray-700 flex items-center gap-2 focus-within:border-blue-500 transition-colors">
              <span className="text-blue-500 text-xl font-bold">$</span>
              <input
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="bg-transparent text-right text-2xl font-black text-white focus:outline-none w-full"
              />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {['50', '100', '500', '1000'].map(v => (
                <button key={v} type="button" onClick={() => setAmount(v)}
                  className="bg-gray-800/40 border border-gray-700 text-gray-400 py-2 rounded-xl text-xs font-bold hover:bg-gray-700 hover:text-white transition-all">
                  ${v}
                </button>
              ))}
            </div>
          </div>

          {/* Note (optional) */}
          <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Note (optional)</label>
            <input
              type="text"
              placeholder="e.g. Rent, Invoice #123"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-[#0b0e14] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !toAccountNumber || !amount}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Processing…</>
            ) : (
              <>Send Transfer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </form>
      </div>
      <TransferReceiptModal
        open={!!receipt}
        receipt={receipt}
        onClose={() => setReceipt(null)}
        onAnotherTransfer={() => setReceipt(null)}
      />
    </div>
  );
}
