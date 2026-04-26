'use client';
import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, ArrowRight, CheckCircle2, Loader2, ChevronDown, Globe2, Building2 } from 'lucide-react';
import { api } from '@/lib/api';
import TransactionPinModal from '@/src/components/TransactionPinModal';

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Germany", "France", "Australia",
  "Switzerland", "Netherlands", "Japan", "Singapore", "Nigeria", "South Africa",
  "United Arab Emirates", "India", "China", "Brazil", "Mexico", "Italy", "Spain",
  "Ireland", "Belgium", "Austria", "Sweden", "Norway", "Denmark", "Finland",
  "New Zealand", "Hong Kong", "South Korea", "Saudi Arabia", "Qatar", "Ghana",
  "Kenya", "Egypt", "Philippines", "Thailand", "Indonesia", "Malaysia", "Vietnam",
  "Poland", "Czech Republic", "Portugal", "Luxembourg", "Cayman Islands",
];

const ACCOUNT_TYPES = ["Savings", "Current", "Fixed Deposit", "Domiciliary"];

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
};

type WireForm = {
  amount: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  bankAddress: string;
  accountType: string;
  country: string;
  swiftCode: string;
  ibanNumber: string;
  note: string;
};

const TransferModal = ({ method, onClose }: any) => {
  const isCrypto = method.id === 'crypto';
  const isWire = method.id === 'wire';

  const [step, setStep] = useState<'form' | 'confirm' | 'success' | 'error'>('form');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [fromAccount, setFromAccount] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [form, setForm] = useState<WireForm>({
    amount: '',
    accountName: '',
    accountNumber: '',
    bankName: '',
    bankAddress: '',
    accountType: '',
    country: '',
    swiftCode: '',
    ibanNumber: '',
    note: '',
  });

  useEffect(() => {
    if (isWire) {
      api.get('/api/accounts').then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setAccounts(data);
        if (data.length > 0) setFromAccount(data[0].accountNumber);
      }).catch(() => { });
    }
  }, [isWire]);

  const selectedAcc = accounts.find(a => a.accountNumber === fromAccount);

  function handleChange(field: keyof WireForm, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  function handleReview(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    if (parseFloat(form.amount) > (selectedAcc?.accountBalance ?? 0)) {
      setErrorMsg('Insufficient balance');
      return;
    }
    setStep('confirm');
  }

  async function handleSubmit() {
    setLoading(true);
    setErrorMsg('');
    try {
      await api.post('/api/transfer', {
        type: 'wire',
        fromAccountNumber: fromAccount,
        amount: parseFloat(form.amount),
        accountName: form.accountName,
        accountNumber: form.accountNumber,
        bankName: form.bankName,
        bankAddress: form.bankAddress,
        accountType: form.accountType,
        country: form.country,
        swiftCode: form.swiftCode,
        ibanNumber: form.ibanNumber,
        note: form.note,
      });
      setStep('success');
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.error || 'Transfer failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  }

  // ─── Wire Transfer ─────────────────────────────────────
  if (isWire) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-[#0f1219] w-full max-w-lg max-h-[92vh] rounded-3xl border border-slate-700/60 shadow-2xl overflow-hidden flex flex-col">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              {step === 'confirm' && (
                <button onClick={() => setStep('form')} className="bg-white/20 p-1.5 rounded-lg hover:bg-white/30 transition-colors">
                  <ArrowLeft size={16} />
                </button>
              )}
              <div>
                <h2 className="text-white font-bold text-lg">
                  {step === 'form' ? 'Wire Transfer' : step === 'confirm' ? 'Confirm Transfer' : step === 'success' ? 'Transfer Submitted' : 'Transfer Failed'}
                </h2>
                <p className="text-white/60 text-xs">
                  {step === 'form' ? 'International bank-to-bank transfer' : step === 'confirm' ? 'Please review the details below' : ''}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="bg-white/20 p-1.5 rounded-lg hover:bg-white/30 transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* ──── SUCCESS ──── */}
            {step === 'success' && (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-5">
                  <CheckCircle2 size={40} className="text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transfer Submitted</h3>
                <p className="text-slate-400 text-sm max-w-xs mb-6">
                  Your wire transfer of <span className="text-white font-bold">${parseFloat(form.amount).toLocaleString()}</span> is now pending review. You will be notified once it has been processed.
                </p>
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 w-full mb-6">
                  <p className="text-amber-400 text-xs font-semibold">⏳ Status: Pending Approval</p>
                  <p className="text-slate-400 text-xs mt-1">This transfer requires admin verification before funds are deducted.</p>
                </div>
                <button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-2xl font-bold text-sm transition-all">
                  Done
                </button>
              </div>
            )}

            {/* ──── ERROR ──── */}
            {step === 'error' && (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mb-5">
                  <X size={40} className="text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Transfer Failed</h3>
                <p className="text-red-300 text-sm mb-6">{errorMsg}</p>
                <button onClick={() => setStep('form')} className="w-full bg-slate-700 hover:bg-slate-600 py-3 rounded-2xl font-bold text-sm transition-all">
                  Try Again
                </button>
              </div>
            )}

            {/* ──── CONFIRM ──── */}
            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="bg-[#1a1d24] rounded-2xl p-5 border border-slate-700/60 space-y-3">
                  {[
                    { label: 'From Account', value: `${selectedAcc?.accountType} — ${fromAccount}` },
                    { label: 'Amount', value: `${selectedAcc?.currency ?? 'USD'} ${parseFloat(form.amount).toLocaleString()}` },
                    { label: 'Beneficiary Name', value: form.accountName },
                    { label: 'Account Number', value: form.accountNumber },
                    { label: 'Bank Name', value: form.bankName },
                    { label: 'Bank Address', value: form.bankAddress },
                    { label: 'Account Type', value: form.accountType },
                    { label: 'Country', value: form.country },
                    { label: 'SWIFT Code', value: form.swiftCode },
                    { label: 'IBAN', value: form.ibanNumber },
                    { label: 'Note', value: form.note },
                  ].filter(r => r.value).map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-start py-2 border-b border-slate-800/60 last:border-0">
                      <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
                      <span className="text-white text-sm font-medium text-right max-w-[55%] break-words">{value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                  <p className="text-amber-400/90 text-xs leading-relaxed">
                    ⚠️ This transfer will be submitted for review. Funds will only be deducted after admin approval. Please ensure all details are correct.
                  </p>
                </div>

                <button
                  onClick={() => setShowPinModal(true)}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                  ) : (
                    <>Confirm & Submit <ArrowRight size={16} /></>
                  )}
                </button>

                <TransactionPinModal
                  isOpen={showPinModal}
                  onClose={() => setShowPinModal(false)}
                  onVerified={() => { setShowPinModal(false); handleSubmit(); }}
                  title="Authorize Wire Transfer"
                />
              </div>
            )}

            {/* ──── FORM ──── */}
            {step === 'form' && (
              <form onSubmit={handleReview} className="space-y-4">
                {errorMsg && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                    <p className="text-sm text-red-300">{errorMsg}</p>
                  </div>
                )}

                {/* From Account */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">From Account</label>
                  <div className="relative">
                    <select
                      value={fromAccount}
                      onChange={e => setFromAccount(e.target.value)}
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                    >
                      {accounts.map(a => (
                        <option key={a._id} value={a.accountNumber} className="bg-[#1a1d24]">
                          {a.accountType.charAt(0).toUpperCase() + a.accountType.slice(1)} — {a.accountNumber} ({a.currency} {a.accountBalance.toLocaleString()})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  </div>
                  {selectedAcc && (
                    <p className="text-xs text-slate-500 mt-1.5">Available: <span className="text-white font-semibold">{selectedAcc.currency} {selectedAcc.accountBalance.toLocaleString()}</span></p>
                  )}
                </div>

                {/* Amount */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Amount</label>
                  <div className="bg-[#1a1d24] p-3 rounded-xl border border-slate-700 flex items-center gap-2 focus-within:border-blue-500 transition-colors">
                    <span className="text-blue-500 text-xl font-bold">$</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={form.amount}
                      onChange={e => handleChange('amount', e.target.value)}
                      required
                      className="bg-transparent text-right text-2xl font-black text-white focus:outline-none w-full"
                    />
                  </div>
                </div>

                {/* Two-column grid for beneficiary details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Account Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Account Name</label>
                    <input
                      type="text"
                      placeholder="Full name of recipient"
                      value={form.accountName}
                      onChange={e => handleChange('accountName', e.target.value)}
                      required
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Account Number</label>
                    <input
                      type="text"
                      placeholder="Recipient account number"
                      value={form.accountNumber}
                      onChange={e => handleChange('accountNumber', e.target.value)}
                      required
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Bank Name */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Bank Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Chase Bank"
                      value={form.bankName}
                      onChange={e => handleChange('bankName', e.target.value)}
                      required
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Bank Address */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Bank Address</label>
                    <input
                      type="text"
                      placeholder="Bank branch address"
                      value={form.bankAddress}
                      onChange={e => handleChange('bankAddress', e.target.value)}
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Account Type</label>
                    <div className="relative">
                      <select
                        value={form.accountType}
                        onChange={e => handleChange('accountType', e.target.value)}
                        className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="">Select type</option>
                        {ACCOUNT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* Country */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Country</label>
                    <div className="relative">
                      <select
                        value={form.country}
                        onChange={e => handleChange('country', e.target.value)}
                        className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                    </div>
                  </div>

                  {/* SWIFT Code */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">SWIFT Code</label>
                    <input
                      type="text"
                      placeholder="e.g. CHASUS33"
                      value={form.swiftCode}
                      onChange={e => handleChange('swiftCode', e.target.value)}
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* IBAN Number */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">IBAN Number</label>
                    <input
                      type="text"
                      placeholder="e.g. GB29 NWBK 6016 1331 9268 19"
                      value={form.ibanNumber}
                      onChange={e => handleChange('ibanNumber', e.target.value)}
                      className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Note (Optional)</label>
                  <textarea
                    placeholder="Add a note for this transfer..."
                    value={form.note}
                    onChange={e => handleChange('note', e.target.value)}
                    rows={3}
                    className="w-full bg-[#1a1d24] border border-slate-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!form.amount || !form.accountName || !form.accountNumber || !form.bankName}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                >
                  Review Transfer <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── Non-Wire Modals (Crypto / Other) ─────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative bg-[#1a1d24] w-full max-w-sm rounded-3xl p-6 border border-gray-800 shadow-2xl">
        <h2 className="text-xl font-bold mb-2 text-center">{method.title}</h2>

        {isCrypto ? (
          /* Crypto Form */
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-gray-400 text-xs block mb-1">Select Account</label>
              <select className="w-full bg-[#242831] border border-gray-700 rounded-xl p-3 text-sm">
                <option>Main Wallet ($45,000.00)</option>
                <option>Savings ($19,600.00)</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Select Asset</label>
              <select className="w-full bg-[#242831] border border-gray-700 rounded-xl p-3 text-sm">
                <option>Bitcoin (BTC)</option>
                <option>Ethereum (ETH)</option>
                <option>USDT</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-xs block mb-1">Amount</label>
              <input type="number" placeholder="0.00" className="w-full bg-[#242831] border border-gray-700 rounded-xl p-3 text-sm" />
            </div>
            <button className="w-full bg-blue-500 py-3 rounded-xl font-bold mt-2 shadow-lg shadow-blue-500/20">
              Confirm Send
            </button>
          </div>
        ) : (
          /* Customer Care Message */
          <div className="text-center py-6">
            <div className="bg-yellow-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-500">
              <Globe2 size={32} />
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              To complete a <span className="font-bold">{method.title}</span>, please contact our support team for verification and routing details.
            </p>
            <button className="w-full bg-blue-500 py-3 rounded-xl font-bold mt-6">
              Contact Support
            </button>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-2 text-gray-500 text-sm py-2">Cancel</button>
      </div>
    </div>
  );
};

export default TransferModal;