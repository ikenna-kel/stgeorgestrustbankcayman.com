"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Send, Users, Mail } from "lucide-react";

type Mode = "single" | "bulk";

export default function AdminMailPage() {
  const [mode, setMode] = useState<Mode>("single");
  const [to, setTo] = useState("");
  const [bulkTo, setBulkTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  function send() {
    setLoading(true);
    setResult("");
    if (mode === "single") {
      api
        .post("/api/admin/mail/send", { to, subject, body })
        .then(() => { setResult("Email sent successfully."); setIsError(false); })
        .catch((err) => { setResult("Error: " + (err.response?.data?.error ?? "Failed")); setIsError(true); })
        .finally(() => setLoading(false));
    } else {
      const recipients = bulkTo.split(/[\n,;]/).map((e) => e.trim()).filter(Boolean);
      api
        .post("/api/admin/mail/bulk", { recipients, subject, body })
        .then((res) => { setResult(`Sent ${res.data.success}/${res.data.total} emails.`); setIsError(false); })
        .catch((err) => { setResult("Error: " + (err.response?.data?.error ?? "Failed")); setIsError(true); })
        .finally(() => setLoading(false));
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Send Mail</h1>
        <p className="text-slate-500 text-sm">Send messages to individual users or bulk recipients.</p>
      </div>

      {/* Mode tabs */}
      <div className="flex gap-1 bg-slate-800/60 border border-slate-700/60 p-1 rounded-2xl w-fit">
        {([
          { id: "single" as Mode, label: "Single", icon: Mail },
          { id: "bulk" as Mode, label: "Bulk", icon: Users },
        ] as { id: Mode; label: string; icon: typeof Mail }[]).map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
              ${mode === id ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 space-y-4">
        {/* To field */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            {mode === "single" ? "Recipient Email" : "Recipients (one per line, comma or semicolon separated)"}
          </label>
          {mode === "single" ? (
            <input
              type="email"
              placeholder="user@example.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
            />
          ) : (
            <textarea
              placeholder={"user1@example.com\nuser2@example.com, user3@example.com"}
              value={bulkTo}
              onChange={(e) => setBulkTo(e.target.value)}
              rows={4}
              className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
            />
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Subject</label>
          <input
            type="text"
            placeholder="Email subject…"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
          />
        </div>

        {/* Body */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message Body</label>
          <textarea
            placeholder="Write your message here…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={7}
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none"
          />
        </div>

        {/* Result alert */}
        {result && (
          <div className={`flex items-start gap-3 rounded-2xl px-4 py-3 border ${isError
            ? "bg-red-500/10 border-red-500/20 text-red-300"
            : "bg-green-500/10 border-green-500/20 text-green-300"}`}>
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isError ? "bg-red-400" : "bg-green-400"}`} />
            <p className="text-sm">{result}</p>
          </div>
        )}

        {/* Send button */}
        <button
          onClick={send}
          disabled={loading || !subject || !body || (mode === "single" ? !to : !bulkTo)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-bold text-sm transition-all"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Sending…
            </>
          ) : (
            <>
              <Send size={14} />
              {mode === "single" ? "Send Email" : "Send Bulk Email"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
