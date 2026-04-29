"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { ChevronRight, Wallet } from "lucide-react";

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
};

type AccountSelectorProps = {
  userId: string;
  userName: string;
  onSelect: (account: Account) => void;
  onBack: () => void;
};

export default function AccountSelector({
  userId,
  userName,
  onSelect,
  onBack,
}: AccountSelectorProps) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/api/admin/users/${userId}`)
      .then((res) => {
        setAccounts(res.data.accounts ?? []);
        if (!res.data.accounts || res.data.accounts.length === 0) {
          setError("This user has no accounts");
        }
      })
      .catch((err) => {
        setError(err?.response?.data?.error || "Failed to load accounts");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="space-y-4">
      <div>
        <button
          onClick={onBack}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 mb-3 transition-colors"
        >
          ← Back
        </button>
        <h2 className="text-lg font-bold text-white mb-1">Select Account</h2>
        <p className="text-slate-400 text-sm">
          Choose account for {userName} to receive deposit
        </p>
      </div>

      {/* Account List */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl overflow-hidden">
        <div className="divide-y divide-slate-700/40">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="px-5 py-4">
                <div className="h-4 bg-slate-700/60 rounded animate-pulse mb-2 w-40" />
                <div className="h-3 bg-slate-700/60 rounded animate-pulse w-32" />
              </div>
            ))
          ) : error ? (
            <div className="px-5 py-12 text-center">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          ) : accounts.length === 0 ? (
            <div className="px-5 py-12 text-center text-slate-500">
              No accounts found
            </div>
          ) : (
            accounts.map((acc) => (
              <button
                key={acc._id}
                onClick={() => onSelect(acc)}
                className="w-full text-left px-5 py-4 hover:bg-slate-700/30 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div className="bg-blue-500/20 p-2.5 rounded-xl">
                    <Wallet size={16} className="text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium group-hover:text-blue-400 transition-colors capitalize">
                      {acc.accountType} Account
                    </p>
                    <p className="text-slate-500 text-xs mt-1">{acc.accountNumber}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Balance: {acc.currency}{" "}
                      {acc.accountBalance.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
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
    </div>
  );
}
