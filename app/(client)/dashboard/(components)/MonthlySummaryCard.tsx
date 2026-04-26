'use client';

import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";

type Totals = {
  totalIn: number;
  totalOut: number;
  net: number;
  currency?: string;
};

function formatCurrency(currency: string, value: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(value);
  } catch {
    return `${currency} ${value.toFixed(2)}`;
  }
}

const MonthlySummaryCard = () => {
  const [totals, setTotals] = useState<Totals>({
    totalIn: 0,
    totalOut: 0,
    net: 0,
    currency: "USD",
  });
  const currency = totals.currency ?? "USD";

  useEffect(() => {
    api
      .get("/api/transactions/summary")
      .then((res) => setTotals(res.data))
      .catch(() => {
        // Keep zeros if summary endpoint fails.
      });
  }, []);

  const netTone = totals.net < 0 ? "text-red-500" : "text-green-500";
  const netText = useMemo(() => formatCurrency(currency, totals.net), [currency, totals.net]);
  const incomeText = useMemo(
    () => formatCurrency(currency, totals.totalIn),
    [currency, totals.totalIn]
  );
  const outText = useMemo(
    () => formatCurrency(currency, totals.totalOut),
    [currency, totals.totalOut]
  );

  return (
    <div className="bg-[#1a1d24] p-4 rounded-2xl border border-gray-800">
      <h3 className="text-gray-300 font-medium mb-6">This Month</h3>
      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <div className="bg-green-900/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-green-500 text-xs">↓</span>
          </div>
          <p className="text-gray-400 text-xs">Income</p>
          <p className="text-green-500 font-bold">{incomeText}</p>
        </div>
        <div>
          <div className="bg-red-900/20 w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2">
            <span className="text-red-500 text-xs">↑</span>
          </div>
          <p className="text-gray-400 text-xs">Expenses</p>
          <p className="text-red-500 font-bold">{outText}</p>
        </div>
      </div>
      <div className="mt-6 pt-4 border-t border-gray-800 flex justify-center gap-2">
        <span className="text-gray-400">Net:</span>
        <span className={`${netTone} font-bold`}>{netText}</span>
      </div>
    </div>
  );
};

export { MonthlySummaryCard };