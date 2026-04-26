"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import axios from "axios";
import { Save, ToggleLeft, ToggleRight, Globe, Phone, MapPin, Mail, Type, Wrench, ShieldCheck, Bitcoin, Wallet, Building2 } from "lucide-react";

type SettingsMap = Record<string, string | number | boolean>;

const TEXT_SETTINGS = [
  { key: "siteName", label: "Site Name", icon: Type, placeholder: "St. Georges Trust Bank" },
  { key: "heroText", label: "Hero Text", icon: Globe, placeholder: "The future of borderless banking." },
  { key: "supportEmail", label: "Support Email", icon: Mail, placeholder: "support@example.com" },
  { key: "helpPhone", label: "Help Phone", icon: Phone, placeholder: "+1 (800) 000-0000" },
  { key: "helpAddress", label: "Help Address", icon: MapPin, placeholder: "123 Main St, City, Country" },
];

const TOGGLE_SETTINGS = [
  {
    key: "maintenanceMode",
    label: "Maintenance Mode",
    description: "Temporarily disable the site for all users while you make updates.",
    icon: Wrench,
    danger: true,
  },
  {
    key: "requireUserOtp",
    label: "Require OTP for User Login",
    description: "When enabled, users must verify a one-time code sent to their email after entering their password.",
    icon: ShieldCheck,
    danger: false,
  },
];

const CRYPTO_SETTINGS = [
  { key: "btcWallet", label: "Bitcoin (BTC) Wallet Address", icon: Bitcoin, placeholder: "bc1q..." },
  { key: "ethWallet", label: "Ethereum (ETH) Wallet Address", icon: Wallet, placeholder: "0x..." },
  { key: "usdtWallet", label: "USDT (TRC-20) Wallet Address", icon: Wallet, placeholder: "T..." },
];

const BANK_SETTINGS = [
  { key: "bankName", label: "Bank Name", placeholder: "Chase Bank" },
  { key: "bankAccountName", label: "Account Name", placeholder: "St. Georges Trust Bank" },
  { key: "bankBeneficiary", label: "Beneficiary Name", placeholder: "St. Georges Trust Bank Inc." },
  { key: "bankAccountNumber", label: "Account Number", placeholder: "000123456789" },
  { key: "bankRoutingNumber", label: "Routing Number (ABA)", placeholder: "021000021" },
  { key: "bankSwiftCode", label: "SWIFT / BIC Code", placeholder: "CHASUS33" },
];

const PAYPAL_SETTINGS = [
  { key: "paypalEmail", label: "PayPal Email Address", placeholder: "payments@stgeorgestrust.com" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    api
      .get("/api/admin/settings")
      .then((res) => {
        const raw: SettingsMap = res.data.settings || {};
        if (raw.requireUserOtp === undefined) raw.requireUserOtp = true;
        setSettings(raw);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    api
      .post("/api/admin/settings", { settings })
      .then(() => { setMessage("Settings saved successfully."); setIsError(false); })
      .catch((err) => { setMessage("Error: " + (err.response?.data?.error ?? "Failed")); setIsError(true); })
      .finally(() => setSaving(false));
  }

  const inputCls = "w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono";

  if (loading) {
    return (
      <div className="space-y-4 max-w-2xl">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-16 bg-slate-800/40 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Site Settings</h1>
        <p className="text-slate-500 text-sm">Configure global settings and deposit details shown to users.</p>
      </div>

      {message && (
        <div className={`flex items-start gap-3 rounded-2xl px-5 py-3 border ${isError
          ? "bg-red-500/10 border-red-500/20 text-red-300"
          : "bg-green-500/10 border-green-500/20 text-green-300"}`}>
          <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${isError ? "bg-red-400" : "bg-green-400"}`} />
          <p className="text-sm">{message}</p>
        </div>
      )}

      <form onSubmit={save} className="space-y-10">
        {/* Toggles */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Security & Access</h2>
          <div className="space-y-3">
            {TOGGLE_SETTINGS.map(({ key, label, description, icon: Icon, danger }) => {
              const val = !!settings[key];
              return (
                <div key={key} className={`flex items-center justify-between gap-4 p-5 rounded-2xl border transition-colors
                    ${danger && val ? "bg-red-500/10 border-red-500/30" : "bg-slate-800/40 border-slate-700/60 hover:border-slate-600"}`}>
                  <div className="flex items-start gap-4 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                      <Icon size={18} className={danger ? "text-red-400" : "text-blue-400"} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{description}</p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setSettings((s) => ({ ...s, [key]: !val }))} className="shrink-0">
                    {val
                      ? <ToggleRight size={38} className={danger ? "text-red-500" : "text-blue-500"} />
                      : <ToggleLeft size={38} className="text-slate-600" />}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crypto deposit addresses */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Crypto Deposit Wallets</h2>
          <p className="text-xs text-slate-600 mb-4">These addresses are shown to users on the Fund Account page.</p>
          <div className="space-y-3">
            {CRYPTO_SETTINGS.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600 transition-colors">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Icon size={13} className="text-amber-400" />
                  {label}
                </label>
                <input
                  type="text"
                  value={String(settings[key] ?? "")}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bank wire details */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Bank Wire / Transfer Details</h2>
          <p className="text-xs text-slate-600 mb-4">Shown to users who select Bank Transfer on the Fund Account page.</p>
          <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl divide-y divide-slate-700/40 overflow-hidden">
            {BANK_SETTINGS.map(({ key, label, placeholder }) => (
              <div key={key} className="p-5 hover:bg-slate-700/20 transition-colors">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Building2 size={13} className="text-cyan-400" />
                  {label}
                </label>
                <input
                  type="text"
                  value={String(settings[key] ?? "")}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>

        {/* PayPal */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">PayPal Deposit</h2>
          <p className="text-xs text-slate-600 mb-4">Shown to users who select PayPal on the Fund Account page.</p>
          <div className="space-y-3">
            {PAYPAL_SETTINGS.map(({ key, label, placeholder }) => (
              <div key={key} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600 transition-colors">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Mail size={13} className="text-indigo-400" />
                  {label}
                </label>
                <input
                  type="text"
                  value={String(settings[key] ?? "")}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>

        {/* General content */}
        <div>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Content & Contact</h2>
          <div className="space-y-3">
            {TEXT_SETTINGS.map(({ key, label, icon: Icon, placeholder }) => (
              <div key={key} className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-5 hover:border-slate-600 transition-colors">
                <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  <Icon size={13} />
                  {label}
                </label>
                <input
                  type="text"
                  value={String(settings[key] ?? "")}
                  onChange={(e) => setSettings((s) => ({ ...s, [key]: e.target.value }))}
                  placeholder={placeholder}
                  className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold text-sm transition-all"
        >
          {saving ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" /></svg> Saving…</>
          ) : (
            <><Save size={15} /> Save All Settings</>
          )}
        </button>
      </form>
    </div>
  );
}
