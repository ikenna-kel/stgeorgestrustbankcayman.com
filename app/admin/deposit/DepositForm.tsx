"use client";

import { useState } from "react";
import { DollarSign, Plus, Replace } from "lucide-react";

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
};

type DepositFormProps = {
  account: Account;
  userName: string;
  onSubmit: (amount: number, operation: "add" | "replace") => void;
  onBack: () => void;
  loading: boolean;
};

export default function DepositForm({
  account,
  userName,
  onSubmit,
  onBack,
  loading,
}: DepositFormProps) {
  const [amount, setAmount] = useState("");
  const [operation, setOperation] = useState<"add" | "replace">("add");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const value = parseFloat(amount);
    if (!amount || isNaN(value) || value <= 0) {
      setError("Please enter an amount greater than 0");
      return;
    }

    onSubmit(value, operation);
  }

  const newBalance =
    operation === "add"
      ? account.accountBalance + parseFloat(amount || "0")
      : parseFloat(amount || "0");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 mb-3 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold text-white mb-1">Enter Deposit Details</h2>
        <p className="text-slate-400 text-sm">
          Deposit to {userName}'s account
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Account Type</span>
          <span className="text-white font-medium capitalize">
            {account.accountType}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Account Number</span>
          <span className="text-white font-mono">{account.accountNumber}</span>
        </div>
        <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-700/60">
          <span className="text-slate-500">Current Balance</span>
          <span className="text-white font-bold">
            {account.currency}{" "}
            {account.accountBalance.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Deposit Amount */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          Deposit Amount ({account.currency})
        </label>
        <div className="relative">
          <DollarSign
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600"
          />
          <input
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>
      </div>

      {/* Operation Selection */}
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Operation
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setOperation("add")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${
              operation === "add"
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
            }`}
          >
            <Plus size={16} />
            Add to Balance
          </button>
          <button
            type="button"
            onClick={() => setOperation("replace")}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all border ${
              operation === "replace"
                ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                : "bg-slate-800/40 border-slate-700/60 text-slate-400 hover:border-slate-600"
            }`}
          >
            <Replace size={16} />
            Replace Balance
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Preview */}
      {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 space-y-2">
          <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Preview
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-400">Operation</span>
              <span className="text-blue-300 font-medium capitalize">
                {operation === "add"
                  ? `Add ${account.currency} ${parseFloat(amount).toFixed(2)}`
                  : `Set to ${account.currency} ${parseFloat(amount).toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm pt-2 border-t border-blue-500/20">
              <span className="text-slate-400">New Balance</span>
              <span className="text-white font-bold">
                {account.currency}{" "}
                {newBalance.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-3 rounded-xl transition-all"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={loading || !amount}
          className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Processing…
            </>
          ) : (
            <>
              <DollarSign size={16} />
              Confirm Deposit
            </>
          )}
        </button>
      </div>
    </form>
  );
}
