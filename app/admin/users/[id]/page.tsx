"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

type User = {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  currency: string;
  role: string;
  isEmailVerified?: boolean;
  isBlocked?: boolean;
  transfersDisabled?: boolean;
  accounts?: { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string }[];
};

export default function AdminUserDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [balanceAccount, setBalanceAccount] = useState("");
  const [newBalance, setNewBalance] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function load() {
    api.get("/api/admin/users/" + id).then((res) => setUser(res.data)).catch((err) => setError(err.response?.data?.error ?? "Failed"));
  }

  useEffect(() => {
    load();
  }, [id]);

  function action(path: string, method: "POST" | "DELETE", body?: object) {
    setError("");
    setMessage("");
    const req = method === "DELETE" ? api.delete("/api/admin/users/" + id) : api.post("/api/admin/users/" + id + path, body ?? {});
    req.then((res) => { setMessage(res.data.message ?? "Done"); load(); }).catch((err) => setError(err.response?.data?.error ?? "Failed"));
  }

  function setBalance() {
    if (!newBalance || !balanceAccount) return;
    setError("");
    setMessage("");
    const isId = balanceAccount.length === 24;
    const payload = isId ? { accountId: balanceAccount, newBalance: parseFloat(newBalance) } : { accountNumber: balanceAccount, newBalance: parseFloat(newBalance) };
    api.patch("/api/admin/users/" + id + "/balance", payload).then(() => { setMessage("Balance updated"); setNewBalance(""); load(); }).catch((err) => setError(err.response?.data?.error ?? "Failed"));
  }

  if (!user) {
    return (
      <div>
        {error && <p className="mb-2 text-red-600 dark:text-red-400">{error}</p>}
        <p className="text-zinc-600">Loading…</p>
      </div>
    );
  }

  return (
    <div>
      <Link href="/admin/users" className="mb-4 inline-block text-zinc-600 hover:underline dark:text-zinc-400">Back to users</Link>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">{user.firstname} {user.lastname}</h1>
      {message && <p className="mb-2 rounded bg-green-100 p-2 text-green-800 dark:bg-green-900/30 dark:text-green-300">{message}</p>}
      {error && <p className="mb-2 rounded bg-red-100 p-2 text-red-800 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
      <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-800">
        <p>Email: {user.email}</p>
        <p>Role: {user.role}</p>
        <p>Verified: {user.isEmailVerified ? "Yes" : "No"}</p>
        <p>Blocked: {user.isBlocked ? "Yes" : "No"}</p>
        <p>Transfers: {user.transfersDisabled ? "Disabled" : "Enabled"}</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => action("/verify", "POST")} className="rounded bg-zinc-800 px-3 py-1.5 text-white dark:bg-zinc-200 dark:text-zinc-900">Verify email</button>
        <button onClick={() => action("/block", "POST", { block: !user.isBlocked })} className="rounded bg-zinc-800 px-3 py-1.5 text-white dark:bg-zinc-200 dark:text-zinc-900">{user.isBlocked ? "Unblock" : "Block"}</button>
        <button onClick={() => action("/transfers", "POST", { disabled: !user.transfersDisabled })} className="rounded bg-zinc-800 px-3 py-1.5 text-white dark:bg-zinc-200 dark:text-zinc-900">{user.transfersDisabled ? "Enable transfers" : "Disable transfers"}</button>
        <button onClick={() => { if (confirm("Delete this user?")) { api.delete("/api/admin/users/" + id).then(() => router.push("/admin/users")).catch((err) => setError(err.response?.data?.error ?? "Failed")); } }} className="rounded bg-red-600 px-3 py-1.5 text-white">Delete user</button>
      </div>
      <div className="mb-6">
        <h2 className="mb-2 font-medium">Set account balance</h2>
        <div className="flex gap-2">
          <input type="text" placeholder="Account number or ID" value={balanceAccount} onChange={(e) => setBalanceAccount(e.target.value)} className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
          <input type="number" step="0.01" placeholder="New balance" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100" />
          <button onClick={setBalance} className="rounded bg-zinc-900 px-4 py-2 text-white dark:bg-zinc-100 dark:text-zinc-900">Set</button>
        </div>
      </div>
      <div>
        <h2 className="mb-2 font-medium">Accounts</h2>
        {user.accounts?.length ? (
          <ul className="space-y-1">
            {user.accounts.map((acc) => (
              <li key={acc._id} className="rounded border border-zinc-200 p-2 dark:border-zinc-700">{acc.accountNumber} - {acc.accountType} - {acc.currency} {acc.accountBalance.toFixed(2)}</li>
            ))}
          </ul>
        ) : (
          <p className="text-zinc-500">No accounts</p>
        )}
      </div>
    </div>
  );
}
