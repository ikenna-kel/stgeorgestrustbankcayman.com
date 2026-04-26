"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminNewUserPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    address: "",
    currency: "USD",
    role: "user" as "user" | "admin",
    isEmailVerified: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    api
      .post("/api/admin/users", form)
      .then((res) => router.push("/admin/users/" + res.data._id))
      .catch((err) => setError(err.response?.data?.error ?? "Failed"))
      .finally(() => setLoading(false));
  }

  return (
    <div>
      <Link href="/admin/users" className="mb-4 inline-block text-zinc-600 hover:underline dark:text-zinc-400">← Users</Link>
      <h1 className="mb-4 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Create user</h1>
      {error && <p className="mb-2 rounded bg-red-100 p-2 text-red-800 dark:bg-red-900/30 dark:text-red-300">{error}</p>}
      <form onSubmit={submit} className="flex max-w-md flex-col gap-3">
        <input
          required
          placeholder="First name"
          value={form.firstname}
          onChange={(e) => setForm((f) => ({ ...f, firstname: e.target.value }))}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          required
          placeholder="Last name"
          value={form.lastname}
          onChange={(e) => setForm((f) => ({ ...f, lastname: e.target.value }))}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          required
          type="password"
          minLength={6}
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <input
          placeholder="Currency"
          value={form.currency}
          onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
          className="rounded border border-zinc-300 px-3 py-2 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.role === "admin"}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.checked ? "admin" : "user" }))}
          />
          Admin
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.isEmailVerified}
            onChange={(e) => setForm((f) => ({ ...f, isEmailVerified: e.target.checked }))}
          />
          Email verified
        </label>
        <button type="submit" disabled={loading} className="rounded bg-zinc-900 py-2 text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900">
          {loading ? "Creating…" : "Create"}
        </button>
      </form>
    </div>
  );
}
