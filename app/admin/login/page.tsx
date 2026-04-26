"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, Mail, Lock, ShieldAlert } from "lucide-react";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await axios.post("/api/auth/admin-login", { email, password });
            const data = res.data;
            if (data.token) {
                typeof window !== "undefined" && localStorage.setItem("token", data.token);
                router.push("/admin");
            }
        } catch (err) {
            const msg =
                axios.isAxiosError(err) && err.response?.data?.error
                    ? err.response.data.error
                    : "Login failed";
            setError(typeof msg === "string" ? msg : "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans flex flex-col">
            {/* Background glows */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
            <div className="fixed bottom-0 right-0 w-[350px] h-[350px] bg-orange-600/8 blur-[100px] rounded-full pointer-events-none" />

            {/* Navbar */}
            <nav className="w-full bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="logo" width={40} height={40} />
                        <span className="text-white font-bold text-lg tracking-tight">St. Georges Trust Bank</span>
                    </Link>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Admin Portal</span>
                </div>
            </nav>

            {/* Main */}
            <div className="flex flex-1 items-center justify-center px-4 py-16 relative z-10">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                            <ShieldAlert size={14} />
                            Restricted — Authorised Personnel Only
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">
                            Admin Sign In
                        </h1>
                        <p className="text-slate-400 text-sm">Your credentials are protected with 256-bit encryption.</p>
                    </div>

                    {/* Card */}
                    <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                        {error && (
                            <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                                <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                                <p className="text-sm text-red-300">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {/* Email */}
                            <div className="relative">
                                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    placeholder="Admin email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/40 transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div className="relative">
                                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500/40 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group mt-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                        </svg>
                                        Authenticating…
                                    </>
                                ) : (
                                    <>
                                        Access Admin Panel
                                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        <Link href="/login" className="hover:text-slate-400 transition-colors">← Back to user login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
