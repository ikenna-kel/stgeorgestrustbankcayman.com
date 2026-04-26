'use client';

import { api } from "@/lib/api";
import { useEffect, useMemo, useState } from "react";
import { ArrowDownLeft, ArrowUpRight, Repeat2 } from "lucide-react";

type Transaction = {
  _id: string;
  date: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  status?: string;
  description?: string;
};

function formatMoney(currency: string, amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

const RecentActivity = ({ userId }: { userId: string }) => {
  const [accountNumbers, setAccountNumbers] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [meRes, txRes] = await Promise.all([
          api.get("/api/me"),
          api.get("/api/transactions?limit=5"),
        ]);

        const accounts = meRes.data.accounts ?? [];
        const myAccountNumbers = accounts.map((a: any) => a.accountNumber);

        if (cancelled) return;
        setAccountNumbers(myAccountNumbers);
        setTransactions(txRes.data ?? []);
      } catch (e: any) {
        if (cancelled) return;
        setError(e?.response?.data?.error ?? "Failed to load recent activity.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const items = useMemo(() => {
    return transactions.slice(0, 5).map((tx) => {
      const toIn = accountNumbers.includes(tx.toAccount);
      const fromIn = accountNumbers.includes(tx.fromAccount);

      const formatted = formatMoney(tx.currency ?? "USD", tx.amount ?? 0);
      const date = tx.date ? new Date(tx.date) : null;
      const dateText = date
        ? `${date.toLocaleDateString()} • ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
        : "";

      if (toIn && !fromIn) {
        return {
          key: tx._id,
          icon: ArrowDownLeft,
          iconBg: "bg-green-900/20",
          iconTone: "text-green-500",
          title: "Credit",
          amountText: `+${formatted}`,
          amountTone: "text-green-500",
          dateText,
        };
      }

      if (fromIn && !toIn) {
        return {
          key: tx._id,
          icon: ArrowUpRight,
          iconBg: "bg-red-900/20",
          iconTone: "text-red-500",
          title: "Debit",
          amountText: `-${formatted}`,
          amountTone: "text-red-500",
          dateText,
        };
      }

      return {
        key: tx._id,
        icon: Repeat2,
        iconBg: "bg-slate-700/30",
        iconTone: "text-slate-300",
        title: "Transfer",
        amountText: formatted,
        amountTone: "text-slate-300",
        dateText,
      };
    });
  }, [accountNumbers, transactions]);

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Recent Activity</h3>
        <span className="text-blue-400 text-sm">Latest 5</span>
      </div>

      {loading ? (
        <div className="text-slate-400 text-sm">Loading...</div>
      ) : error ? (
        <div className="text-red-400 text-sm">{error}</div>
      ) : items.length === 0 ? (
        <div className="text-slate-500 text-sm">No transactions found.</div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="bg-[#1a1d24] p-4 rounded-2xl flex items-center justify-between border border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className={`${item.iconBg} p-3 rounded-xl`}>
                    <Icon size={18} className={item.iconTone} />
                  </div>
                  <div>
                    <p className="font-bold">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.dateText}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`${item.amountTone} font-bold`}>{item.amountText}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { RecentActivity };