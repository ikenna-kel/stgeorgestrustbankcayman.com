"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import {
  ArrowRight, ArrowLeft, Eye, EyeOff, ShieldCheck, User, Mail, Lock, MapPin,
  Phone, Calendar, Globe, Users, CreditCard, KeyRound, CheckCircle2, Loader2
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Personal Details", icon: User },
  { id: 2, label: "Contact Details", icon: MapPin },
  { id: 3, label: "Next of Kin", icon: Users },
  { id: 4, label: "KYC Verification", icon: CreditCard },
  { id: 5, label: "Security Setup", icon: ShieldCheck },
];

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const ID_TYPES = ["National ID", "International Passport", "Driver's License", "Voter's Card", "SSN Card"];
const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Germany", "France", "Australia",
  "Nigeria", "South Africa", "India", "China", "Brazil", "Mexico", "Japan",
  "Singapore", "United Arab Emirates", "Switzerland", "Netherlands", "Ireland",
  "Ghana", "Kenya", "Egypt", "Philippines", "Thailand", "Indonesia", "Malaysia",
];
const RELATIONSHIPS = ["Spouse", "Parent", "Sibling", "Child", "Friend", "Other"];

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [form, setForm] = useState({
    // Step 1: Personal
    firstname: "", lastname: "", email: "", password: "", phone: "",
    dateOfBirth: "", gender: "", nationality: "",
    // Step 2: Contact
    address: "", city: "", state: "", zipCode: "", country: "",
    // Step 3: Next of Kin
    nextOfKinName: "", nextOfKinRelationship: "", nextOfKinPhone: "",
    nextOfKinEmail: "", nextOfKinAddress: "",
    // Step 4: KYC
    idType: "", idNumber: "", ssn: "",
    // Step 5: Security
    loginPin: "", transactionPin: "", confirmLoginPin: "", confirmTransactionPin: "",
  });

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function canProceed(): boolean {
    if (step === 1) return !!(form.firstname && form.lastname && form.email && form.password && form.password.length >= 6);
    if (step === 2) return true; // optional
    if (step === 3) return true; // optional
    if (step === 4) return true; // optional
    if (step === 5) return (
      form.loginPin.length === 4 && form.transactionPin.length === 4 &&
      form.loginPin === form.confirmLoginPin && form.transactionPin === form.confirmTransactionPin
    );
    return true;
  }

  function next() {
    setError("");
    if (step === 5) {
      handleSubmit();
      return;
    }
    if (!canProceed()) {
      setError("Please fill in all required fields");
      return;
    }
    setStep(s => Math.min(s + 1, 5));
  }

  function back() {
    setError("");
    setStep(s => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!canProceed()) {
      setError("Please ensure all PINs match and are 4 digits");
      return;
    }
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await axios.post("/api/auth/signup", {
        firstname: form.firstname,
        lastname: form.lastname,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender || undefined,
        nationality: form.nationality || undefined,
        address: form.address || undefined,
        city: form.city || undefined,
        state: form.state || undefined,
        zipCode: form.zipCode || undefined,
        country: form.country || undefined,
        nextOfKinName: form.nextOfKinName || undefined,
        nextOfKinRelationship: form.nextOfKinRelationship || undefined,
        nextOfKinPhone: form.nextOfKinPhone || undefined,
        nextOfKinEmail: form.nextOfKinEmail || undefined,
        nextOfKinAddress: form.nextOfKinAddress || undefined,
        idType: form.idType || undefined,
        idNumber: form.idNumber || undefined,
        ssn: form.ssn || undefined,
        loginPin: form.loginPin,
        transactionPin: form.transactionPin,
        currency: "USD",
      });
      setMessage("Account created! Check your email to verify.");
      setStep(6); // success view
    } catch (err) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Signup failed";
      setError(typeof msg === "string" ? msg : "Failed");
    } finally {
      setLoading(false);
    }
  }

  const inputCls = "w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all";
  const selectCls = `${inputCls} appearance-none cursor-pointer`;
  const labelCls = "text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2";

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 font-sans flex flex-col">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[400px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Navbar */}
      <nav className="w-full z-50 bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/logo.png" alt="logo" width={40} height={40} />
            <span className="text-white font-bold text-lg tracking-tight">St. Georges Trust Bank</span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-slate-500 hidden sm:inline">Already have an account?</span>
            <Link href="/login" className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-full font-semibold border border-slate-700 transition-colors">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      {/* Main */}
      <div className="flex flex-1 justify-center px-4 py-10 relative z-10">
        <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8">

          {/* LEFT: Form */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="text-center lg:text-left mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-2 rounded-full mb-4">
                <ShieldCheck size={14} />
                FDIC Insured · 256-bit Encryption
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Open your free account</h1>
              <p className="text-slate-400 text-sm">Complete the steps below to create your banking profile.</p>
            </div>

            {/* Step indicator (mobile) */}
            <div className="flex lg:hidden items-center gap-1 mb-6">
              {STEPS.map(s => (
                <div key={s.id} className={`flex-1 h-1.5 rounded-full transition-all ${step >= s.id ? 'bg-blue-500' : 'bg-slate-700'}`} />
              ))}
            </div>

            {/* Card */}
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-6 sm:p-8 backdrop-blur-sm shadow-2xl">
              {error && (
                <div className="mb-5 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* SUCCESS VIEW */}
              {step === 6 && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle2 size={40} className="text-green-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Account Created!</h2>
                  <p className="text-slate-400 text-sm max-w-sm mx-auto">{message}</p>
                  <Link href="/login" className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-full font-bold text-sm transition-all">
                    Go to Login <ArrowRight size={16} />
                  </Link>
                </div>
              )}

              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">Personal Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>First Name *</label>
                      <input value={form.firstname} onChange={e => set('firstname', e.target.value)} placeholder="John" required className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Last Name *</label>
                      <input value={form.lastname} onChange={e => set('lastname', e.target.value)} placeholder="Doe" required className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Email Address *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john.doe@email.com" required className={inputCls} />
                  </div>
                  <div className="relative">
                    <label className={labelCls}>Password *</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      placeholder="Min 6 characters"
                      minLength={6}
                      required
                      className={`${inputCls} pr-12`}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 bottom-3 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (800) 000-0000" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Date of Birth</label>
                      <input type="date" value={form.dateOfBirth} onChange={e => set('dateOfBirth', e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Gender</label>
                      <select value={form.gender} onChange={e => set('gender', e.target.value)} className={selectCls}>
                        <option value="">Select...</option>
                        {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Nationality</label>
                      <input value={form.nationality} onChange={e => set('nationality', e.target.value)} placeholder="e.g. American" className={inputCls} />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Contact Details */}
              {step === 2 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">Contact Details</h2>
                  <div>
                    <label className={labelCls}>Street Address</label>
                    <input value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main Street" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>City</label>
                      <input value={form.city} onChange={e => set('city', e.target.value)} placeholder="New York" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>State / Province</label>
                      <input value={form.state} onChange={e => set('state', e.target.value)} placeholder="NY" className={inputCls} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Zip / Postal Code</label>
                      <input value={form.zipCode} onChange={e => set('zipCode', e.target.value)} placeholder="10001" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Country</label>
                      <select value={form.country} onChange={e => set('country', e.target.value)} className={selectCls}>
                        <option value="">Select country...</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Next of Kin */}
              {step === 3 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">Next of Kin</h2>
                  <p className="text-slate-500 text-xs mb-2">Emergency contact information for your account.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name</label>
                      <input value={form.nextOfKinName} onChange={e => set('nextOfKinName', e.target.value)} placeholder="Jane Doe" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Relationship</label>
                      <select value={form.nextOfKinRelationship} onChange={e => set('nextOfKinRelationship', e.target.value)} className={selectCls}>
                        <option value="">Select...</option>
                        {RELATIONSHIPS.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Phone Number</label>
                      <input type="tel" value={form.nextOfKinPhone} onChange={e => set('nextOfKinPhone', e.target.value)} placeholder="+1 (800) 000-0000" className={inputCls} />
                    </div>
                    <div>
                      <label className={labelCls}>Email</label>
                      <input type="email" value={form.nextOfKinEmail} onChange={e => set('nextOfKinEmail', e.target.value)} placeholder="jane@email.com" className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    <input value={form.nextOfKinAddress} onChange={e => set('nextOfKinAddress', e.target.value)} placeholder="456 Oak Avenue" className={inputCls} />
                  </div>
                </div>
              )}

              {/* STEP 4: KYC Verification */}
              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="text-lg font-bold text-white mb-4">KYC Verification</h2>
                  <p className="text-slate-500 text-xs mb-2">Provide identification documents for account verification.</p>
                  <div>
                    <label className={labelCls}>ID Type</label>
                    <select value={form.idType} onChange={e => set('idType', e.target.value)} className={selectCls}>
                      <option value="">Select ID type...</option>
                      {ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>ID Number</label>
                    <input value={form.idNumber} onChange={e => set('idNumber', e.target.value)} placeholder="Enter ID number" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>SSN (Social Security Number)</label>
                    <input value={form.ssn} onChange={e => set('ssn', e.target.value)} placeholder="XXX-XX-XXXX" className={inputCls} />
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                    <p className="text-amber-400/80 text-xs">🔒 Your documents are encrypted and stored securely. We never share your personal data.</p>
                  </div>
                </div>
              )}

              {/* STEP 5: Security Setup */}
              {step === 5 && (
                <div className="space-y-5">
                  <h2 className="text-lg font-bold text-white mb-4">Security Setup</h2>

                  <div className="bg-[#0b1224] rounded-2xl p-5 border border-slate-700/60 space-y-4">
                    <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2"><KeyRound size={16} /> Login PIN</h3>
                    <p className="text-slate-500 text-xs">4-digit PIN required every time you log in.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Login PIN</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={form.loginPin}
                          onChange={e => set('loginPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="••••"
                          className={`${inputCls} text-center text-lg tracking-[0.5em] font-mono`}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Confirm PIN</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={form.confirmLoginPin}
                          onChange={e => set('confirmLoginPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="••••"
                          className={`${inputCls} text-center text-lg tracking-[0.5em] font-mono`}
                        />
                      </div>
                    </div>
                    {form.loginPin.length === 4 && form.confirmLoginPin.length === 4 && form.loginPin !== form.confirmLoginPin && (
                      <p className="text-red-400 text-xs">PINs do not match</p>
                    )}
                  </div>

                  <div className="bg-[#0b1224] rounded-2xl p-5 border border-slate-700/60 space-y-4">
                    <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2"><ShieldCheck size={16} /> Transaction PIN</h3>
                    <p className="text-slate-500 text-xs">4-digit PIN required before every transaction.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>Transaction PIN</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={form.transactionPin}
                          onChange={e => set('transactionPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="••••"
                          className={`${inputCls} text-center text-lg tracking-[0.5em] font-mono`}
                        />
                      </div>
                      <div>
                        <label className={labelCls}>Confirm PIN</label>
                        <input
                          type="password"
                          inputMode="numeric"
                          maxLength={4}
                          value={form.confirmTransactionPin}
                          onChange={e => set('confirmTransactionPin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="••••"
                          className={`${inputCls} text-center text-lg tracking-[0.5em] font-mono`}
                        />
                      </div>
                    </div>
                    {form.transactionPin.length === 4 && form.confirmTransactionPin.length === 4 && form.transactionPin !== form.confirmTransactionPin && (
                      <p className="text-red-400 text-xs">PINs do not match</p>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 text-center px-2">
                    By creating an account, you agree to our{" "}
                    <a href="#" className="text-blue-400 hover:underline">Terms of Service</a>{" "}
                    and <a href="#" className="text-blue-400 hover:underline">Privacy Policy</a>.
                  </p>
                </div>
              )}

              {/* Navigation buttons */}
              {step <= 5 && (
                <div className="flex items-center gap-3 mt-6">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={back}
                      className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-5 py-3 rounded-full font-semibold text-sm transition-all"
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={next}
                    disabled={loading || !canProceed()}
                    className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2 group"
                  >
                    {loading ? (
                      <><Loader2 size={16} className="animate-spin" /> Creating Account...</>
                    ) : step === 5 ? (
                      <>Create Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    ) : (
                      <>Continue <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </button>
                </div>
              )}
            </div>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">Log in</Link>
              {" · "}
              <Link href="/" className="hover:text-slate-300 transition-colors">Back to Home</Link>
            </p>
          </div>

          {/* RIGHT: Steps List (Desktop) */}
          <div className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-32 space-y-2">
              <h3 className="text-xs font-bold text-slate-600 uppercase tracking-widest mb-4 px-2">Registration Steps</h3>
              {STEPS.map(s => {
                const StepIcon = s.icon;
                const isCompleted = step > s.id;
                const isCurrent = step === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { if (s.id <= step) setStep(s.id); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all
                      ${isCurrent
                        ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20'
                        : isCompleted
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-pointer hover:bg-green-500/20'
                          : 'bg-slate-800/40 text-slate-500 border border-slate-700/40'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0
                      ${isCurrent ? 'bg-blue-600 text-white' : isCompleted ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'}`}>
                      {isCompleted ? <CheckCircle2 size={16} /> : <StepIcon size={16} />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold">{s.label}</p>
                      <p className={`text-[10px] ${isCurrent ? 'text-blue-400/60' : isCompleted ? 'text-green-400/60' : 'text-slate-600'}`}>
                        Step {s.id} of 5
                      </p>
                    </div>
                  </button>
                );
              })}

              {step === 6 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 mt-4">
                  <p className="text-green-400 text-xs font-semibold">✅ Registration Complete</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
