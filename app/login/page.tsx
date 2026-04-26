"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { ArrowRight, Eye, EyeOff, Mail, Lock, ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

type Step = "credentials" | "otp" | "pin";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingToken, setPendingToken] = useState("");
  const [pendingRole, setPendingRole] = useState("");
  const router = useRouter();

  function redirectByRole(role: string) {
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/request-otp", { email, password, purpose: "login" });
      const data = res.data;

      if (data.otpRequired === false && data.token) {
        // OTP disabled — need PIN verification now
        setPendingToken(data.token);
        setPendingRole(data.role || "user");
        typeof window !== "undefined" && localStorage.setItem("token", data.token);
        setStep("pin");
      } else {
        setStep("otp");
      }
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Invalid email or password";
      setError(typeof msg === "string" ? msg : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/verify-otp", {
        email,
        code: otp,
        purpose: "login",
      });
      const data = res.data;
      if (data.token) {
        setPendingToken(data.token);
        setPendingRole(data.role || "user");
        typeof window !== "undefined" && localStorage.setItem("token", data.token);
        setStep("pin");
      }
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Invalid OTP. Please try again.";
      setError(typeof msg === "string" ? msg : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/api/auth/verify-pin", { pin, type: "login" });
      redirectByRole(pendingRole);
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Invalid PIN";
      setError(typeof msg === "string" ? msg : "PIN verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans flex flex-col">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <span className="text-white font-bold text-lg tracking-tight">St. Georges Trust Bank</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500">New here?</span>
            <Link href="/signup" className="bg-white text-slate-900 px-5 py-2 rounded-full font-semibold hover:bg-slate-200 transition-colors text-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex flex-1 items-center justify-center px-4 py-16 relative z-10">
        <div className="w-full max-w-md">

          {/* Step: Credentials */}
          {step === "credentials" && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
                  <ShieldCheck size={14} />
                  Secure Login
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Welcome back</h1>
                <p className="text-slate-400">Sign in to access your account</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                {error && (
                  <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleCredentials} className="flex flex-col gap-4">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type="email" placeholder="Email address" value={email}
                      onChange={(e) => setEmail(e.target.value)} required
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                      type={showPassword ? "text" : "password"} placeholder="Password" value={password}
                      onChange={(e) => setPassword(e.target.value)} required
                      className="w-full bg-slate-900/60 border border-slate-700 rounded-xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>

                  <div className="flex justify-end -mt-1">
                    <a href="#" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">Forgot password?</a>
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group mt-1">
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Verifying…</>
                    ) : (
                      <>Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </form>
              </div>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Sign up free</Link>
                {" · "}<Link href="/" className="hover:text-slate-300 transition-colors">Home</Link>
              </p>
            </>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl mb-6 mx-auto">
                  <KeyRound size={28} className="text-blue-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Check your email</h1>
                <p className="text-slate-400">We sent a 6-digit code to</p>
                <p className="text-white font-semibold mt-1">{email}</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                {error && (
                  <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                  <input
                    type="text" inputMode="numeric" placeholder="000000" value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} maxLength={6}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-4 text-white text-center text-2xl font-mono tracking-[0.5em] placeholder:text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                  />
                  <p className="text-xs text-slate-500 text-center">The code expires in 10 minutes</p>
                  <button type="submit" disabled={loading || otp.length !== 6}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group mt-1">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <>Verify Code <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>
              </div>

              <div className="mt-6 text-center space-y-2">
                <p className="text-sm text-slate-500">
                  Didn't receive the code?{" "}
                  <button className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                    onClick={() => { setOtp(""); setError(""); axios.post("/api/auth/request-otp", { email, password, purpose: "login" }).catch(() => { }); }}>
                    Resend
                  </button>
                </p>
                <p className="text-sm text-slate-500">
                  <button onClick={() => { setStep("credentials"); setOtp(""); setError(""); }} className="hover:text-slate-300 transition-colors">
                    ← Use a different account
                  </button>
                </p>
              </div>
            </>
          )}

          {/* Step: Login PIN */}
          {step === "pin" && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-6 mx-auto">
                  <ShieldCheck size={28} className="text-emerald-400" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3">Enter Login PIN</h1>
                <p className="text-slate-400">Enter your 4-digit login PIN to continue</p>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 backdrop-blur-sm shadow-2xl">
                {error && (
                  <div className="mb-6 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                    <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <p className="text-sm text-red-300">{error}</p>
                  </div>
                )}

                <form onSubmit={handleVerifyPin} className="flex flex-col gap-4">
                  <input
                    type="password" inputMode="numeric" placeholder="••••" value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))} maxLength={4}
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-5 text-white text-center text-3xl font-mono tracking-[0.8em] placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                  />
                  <button type="submit" disabled={loading || pin.length !== 4}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group mt-1">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : <>Sign In <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>}
                  </button>
                </form>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
