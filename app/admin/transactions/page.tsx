"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Plus, X, ArrowLeftRight, CheckCircle2, XCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";

type Tx = {
  _id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  date: string;
  description?: string;
  metadata?: Record<string, unknown>;
};

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
  reversed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export default function AdminTransactionsPage() {
  const [list, setList] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ fromAccount: "", toAccount: "", amount: "", currency: "USD", updateBalances: true });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [creating, setCreating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  function load() {
    setLoading(true);
    api
      .get("/api/admin/transactions?limit=50")
      .then((res) => setList(Array.isArray(res.data) ? res.data : []))
      .catch(() => { })
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, []);

  function create(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setCreating(true);
    api
      .post("/api/admin/transactions", {
        fromAccount: form.fromAccount,
        toAccount: form.toAccount,
        amount: parseFloat(form.amount),
        currency: form.currency,
        updateBalances: form.updateBalances,
      })
      .then(() => {
        setMessage("Transaction created successfully.");
        setIsError(false);
        setShowCreate(false);
        setForm({ fromAccount: "", toAccount: "", amount: "", currency: "USD", updateBalances: true });
        load();
      })
      .catch((err) => {
        setMessage("Error: " + (err.response?.data?.error ?? "Failed"));
        setIsError(true);
      })
      .finally(() => setCreating(false));
  }

  async function handleApprove(txId: string) {
    setActionLoading(txId);
    try {
      await api.patch(`/api/admin/transactions/${txId}`, { status: "completed" });
      setMessage("Transaction approved and balance deducted.");
      setIsError(false);
      load();
    } catch (err: any) {
      setMessage("Error: " + (err.response?.data?.error ?? "Approve failed"));
      setIsError(true);
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(txId: string) {
    setActionLoading(txId);
    try {
      await api.patch(`/api/admin/transactions/${txId}`, { status: "failed" });
      setMessage("Transaction rejected.");
      setIsError(false);
      load();
    } catch (err: any) {
      setMessage("Error: " + (err.response?.data?.error ?? "Reject failed"));
      setIsError(true);
    } finally {
      setActionLoading(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Transactions</h1>
          <p className="text-slate-500 text-sm">{list.length} recent records</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all
            ${showCreate
              ? "bg-slate-700 hover:bg-slate-600 text-slate-300"
              : "bg-blue-600 hover:bg-blue-500 text-white"}`}
        >
          {showCreate ? <><X size={15} /> Cancel</> : <><Plus size={15} /> Create Transaction</>}
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
            <ArrowLeftRight size={15} className="text-blue-400" />
            New Transaction
          </h2>
          <form onSubmit={create} className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "fromAccount", placeholder: "From account number", label: "From Account" },
              { name: "toAccount", placeholder: "To account number", label: "To Account" },
              { name: "amount", placeholder: "0.00", label: "Amount", type: "number" },
              { name: "currency", placeholder: "USD", label: "Currency" },
            ].map(({ name, placeholder, label, type }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</label>
                <input
                  required={name !== "currency"}
                  type={type ?? "text"}
                  step={type === "number" ? "0.01" : undefined}
                  placeholder={placeholder}
                  value={(form as unknown as Record<string, string>)[name]}
                  onChange={(e) => setForm((f) => ({ ...f, [name]: e.target.value }))}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            ))}
            <div className="sm:col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <div
                  onClick={() => setForm((f) => ({ ...f, updateBalances: !f.updateBalances }))}
                  className={`w-11 h-6 rounded-full flex items-center transition-colors ${form.updateBalances ? "bg-blue-600" : "bg-slate-600"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow mx-1 transition-transform ${form.updateBalances ? "translate-x-5" : "translate-x-0"}`} />
                </div>
                <span className="text-sm text-slate-300">Update account balances</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-2.5 rounded-full font-bold text-sm transition-all"
              >
                {creating
                  ? <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Creating…</>
                  : "Create Transaction"}
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
                {["From", "To", "Amount", "Type", "Status", "Date", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="border-b border-slate-700/40">
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-5 py-4"><div className="h-4 bg-slate-700/60 rounded animate-pulse w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : list.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-500">No transactions found</td></tr>
              ) : (
                list.map((tx) => (
                  <>
                    <tr key={tx._id} className="border-b border-slate-700/40 hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-4 text-slate-300 font-mono text-xs">{tx.fromAccount}</td>
                      <td className="px-5 py-4 text-slate-300 font-mono text-xs">{tx.toAccount}</td>
                      <td className="px-5 py-4 font-semibold text-white">{tx.currency} {tx.amount?.toLocaleString()}</td>
                      <td className="px-5 py-4 text-slate-400 capitalize">{tx.type}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize
                          ${STATUS_STYLES[tx.status?.toLowerCase()] ?? "bg-slate-700/60 text-slate-400 border-slate-600"}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{new Date(tx.date).toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {tx.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(tx._id)}
                                disabled={actionLoading === tx._id}
                                className="flex items-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                              >
                                {actionLoading === tx._id ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                                Approve
                              </button>
                              <button
                                onClick={() => handleReject(tx._id)}
                                disabled={actionLoading === tx._id}
                                className="flex items-center gap-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all disabled:opacity-50"
                              >
                                <XCircle size={12} />
                                Reject
                              </button>
                            </>
                          )}
                          {tx.type === "wire" && tx.metadata && (
                            <button
                              onClick={() => setExpandedRow(expandedRow === tx._id ? null : tx._id)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {expandedRow === tx._id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedRow === tx._id && tx.metadata && (
                      <tr key={`${tx._id}-detail`} className="border-b border-slate-700/40 bg-slate-800/30">
                        <td colSpan={7} className="px-8 py-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            {[
                              { label: "Account Name", value: tx.metadata.accountName },
                              { label: "Bank Name", value: tx.metadata.bankName },
                              { label: "Bank Address", value: tx.metadata.bankAddress },
                              { label: "Account Type", value: tx.metadata.accountType },
                              { label: "Country", value: tx.metadata.country },
                              { label: "SWIFT Code", value: tx.metadata.swiftCode },
                              { label: "IBAN", value: tx.metadata.ibanNumber },
                            ].filter(r => r.value).map(({ label, value }) => (
                              <div key={label}>
                                <p className="text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                                <p className="text-white font-medium">{String(value)}</p>
                              </div>
                            ))}
                          </div>
                          {tx.description && (
                            <div className="mt-3">
                              <p className="text-slate-500 uppercase tracking-wider text-xs mb-1">Note</p>
                              <p className="text-white text-sm">{tx.description}</p>
                            </div>
                          )}
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
