'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PiggyBank, CheckCircle2, Copy, Check, Building2, Bitcoin, Wallet, CreditCard, Upload, AlertTriangle, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { api } from '@/lib/api';

type Settings = {
    btcWallet?: string;
    ethWallet?: string;
    usdtWallet?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankAccountName?: string;
    bankRoutingNumber?: string;
    bankSwiftCode?: string;
    bankBeneficiary?: string;
    paypalEmail?: string;
};

type PaymentMethod = 'bank' | 'paypal' | 'crypto';
type CryptoType = 'btcWallet' | 'ethWallet' | 'usdtWallet';

const FundAccountPage = () => {
    const router = useRouter();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [selectedCrypto, setSelectedCrypto] = useState<CryptoType>('btcWallet');
    const [amount, setAmount] = useState('');
    const [settings, setSettings] = useState<Settings>({});
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [copied, setCopied] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [proofPreview, setProofPreview] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        axios.get('/api/settings')
            .then(res => setSettings(res.data))
            .catch(() => { })
            .finally(() => setLoadingSettings(false));
    }, []);

    function copyText(text: string) {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            setProofFile(file);
            const reader = new FileReader();
            reader.onload = () => setProofPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    function removeProof() {
        setProofFile(null);
        setProofPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    async function handleSubmit() {
        if (!amount || parseFloat(amount) <= 0) {
            setError('Please enter a valid amount');
            return;
        }
        if (!proofFile) {
            setError('Payment proof is required');
            return;
        }
        setError('');
        setSubmitting(true);

        try {
            // Upload the proof file via form data
            const formData = new FormData();
            formData.append('file', proofFile);

            // For simplicity, we'll create a data URL-based proof
            const proofData = {
                fileUrl: proofPreview || '',
                fileName: proofFile.name,
                fileSize: proofFile.size,
                mimeType: proofFile.type,
            };

            await api.post('/api/payment-proof', proofData);
            setDone(true);
        } catch (err) {
            setError('Failed to submit payment. Please try again.');
        } finally {
            setSubmitting(false);
        }
    }

    const cryptoOptions = [
        { id: 'btcWallet' as CryptoType, name: 'Bitcoin (BTC)', icon: <Bitcoin size={18} />, color: 'bg-amber-500' },
        { id: 'ethWallet' as CryptoType, name: 'Ethereum (ETH)', icon: <Wallet size={18} />, color: 'bg-indigo-500' },
        { id: 'usdtWallet' as CryptoType, name: 'USDT (TRC-20)', icon: <Wallet size={18} />, color: 'bg-emerald-500' },
    ];

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans pb-24">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-b from-[#00a3e0] to-[#0b0e14] pt-6 pb-12 px-6 rounded-b-[3rem]">
                <button onClick={() => router.back()} className="bg-white/10 p-2 rounded-xl mb-6 backdrop-blur-md hover:bg-white/20 transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
                        <PiggyBank size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Fund Your Account</h1>
                    <p className="text-white/70 text-sm max-w-xs">Choose your preferred deposit method and upload payment proof.</p>
                </div>
            </div>

            <div className="px-4 sm:px-6 max-w-2xl mx-auto -mt-6 space-y-6">
                {done ? (
                    <div className="bg-[#1a1d24] border border-green-500/30 rounded-3xl p-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Deposit Submitted!</h2>
                        <p className="text-slate-400 text-sm">
                            Your payment proof for <span className="text-white font-bold">${parseFloat(amount).toLocaleString()}</span> has been submitted. Your account will be credited once verified by our team.
                        </p>
                        <button onClick={() => { setDone(false); setAmount(''); removeProof(); setSelectedMethod(null); }} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm font-semibold transition-colors mt-2">
                            Make Another Deposit
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Step 1: Choose Method */}
                        <section>
                            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-4 ml-1">Choose Deposit Method</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {[
                                    { id: 'bank' as PaymentMethod, name: 'Bank Transfer', icon: <Building2 size={22} />, color: 'from-blue-500 to-blue-600' },
                                    { id: 'paypal' as PaymentMethod, name: 'PayPal', icon: <CreditCard size={22} />, color: 'from-indigo-500 to-purple-600' },
                                    { id: 'crypto' as PaymentMethod, name: 'Cryptocurrency', icon: <Bitcoin size={22} />, color: 'from-amber-500 to-orange-600' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        onClick={() => setSelectedMethod(method.id)}
                                        className={`relative p-5 rounded-2xl border transition-all text-center group overflow-hidden
                                            ${selectedMethod === method.id
                                                ? 'bg-[#1a1d24] border-blue-500 shadow-lg shadow-blue-500/10'
                                                : 'bg-[#1a1d24] border-gray-800 hover:border-gray-600'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center mx-auto mb-3 shadow-lg text-white`}>
                                            {method.icon}
                                        </div>
                                        <p className="font-bold text-sm text-white">{method.name}</p>
                                        {selectedMethod === method.id && (
                                            <div className="absolute top-3 right-3">
                                                <CheckCircle2 size={18} className="text-blue-400" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {selectedMethod && (
                            <>
                                {/* Step 2: Show Details */}
                                <section className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                                    {loadingSettings ? (
                                        <div className="space-y-3">
                                            {[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-slate-700/40 rounded-xl animate-pulse" />)}
                                        </div>
                                    ) : selectedMethod === 'bank' ? (
                                        <>
                                            <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">Bank Transfer Details</h3>
                                            <div className="space-y-3">
                                                {[
                                                    { label: 'Bank Name', value: settings.bankName },
                                                    { label: 'Account Name', value: settings.bankAccountName || settings.bankBeneficiary },
                                                    { label: 'Account Number', value: settings.bankAccountNumber },
                                                    { label: 'SWIFT / BIC', value: settings.bankSwiftCode },
                                                    { label: 'Routing Number', value: settings.bankRoutingNumber },
                                                ].filter(r => r.value).map(({ label, value }) => (
                                                    <div key={label} className="flex justify-between items-center py-2.5 border-b border-slate-800/60 last:border-0">
                                                        <span className="text-xs text-slate-500 uppercase tracking-wider">{label}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white font-mono text-sm">{value}</span>
                                                            <button onClick={() => copyText(value!)} className="text-slate-500 hover:text-blue-400 transition-colors">
                                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                {!settings.bankName && (
                                                    <p className="text-slate-500 text-sm text-center py-4">Bank details not configured yet. Please contact support.</p>
                                                )}
                                            </div>
                                        </>
                                    ) : selectedMethod === 'paypal' ? (
                                        <>
                                            <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">PayPal Details</h3>
                                            {settings.paypalEmail ? (
                                                <div className="space-y-3">
                                                    <div className="flex justify-between items-center py-2.5">
                                                        <span className="text-xs text-slate-500 uppercase tracking-wider">PayPal Email</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-white font-mono text-sm">{settings.paypalEmail}</span>
                                                            <button onClick={() => copyText(settings.paypalEmail!)} className="text-slate-500 hover:text-blue-400 transition-colors">
                                                                {copied ? <Check size={14} /> : <Copy size={14} />}
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                                                        <p className="text-blue-400 text-xs">Send the exact amount to the PayPal email above, then upload your payment screenshot below.</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 text-sm text-center py-4">PayPal details not configured. Please contact support.</p>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">Crypto Deposit</h3>
                                            <div className="flex gap-2 mb-4">
                                                {cryptoOptions.map(opt => (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() => setSelectedCrypto(opt.id)}
                                                        className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-all
                                                            ${selectedCrypto === opt.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'bg-slate-800 text-slate-400 border border-slate-700'}`}
                                                    >
                                                        {opt.icon}
                                                        {opt.name.split(' ')[0]}
                                                    </button>
                                                ))}
                                            </div>
                                            {settings[selectedCrypto] ? (
                                                <div className="space-y-3">
                                                    <div className="bg-[#0b0e14] rounded-2xl p-4 border border-gray-800">
                                                        <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Wallet Address</p>
                                                        <p className="text-white font-mono text-sm break-all leading-relaxed">{settings[selectedCrypto] as string}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => copyText(settings[selectedCrypto] as string)}
                                                        className={`w-full py-3 rounded-2xl flex items-center justify-center gap-2 font-semibold text-sm transition-all
                                                            ${copied ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue-600/20 text-blue-400 border border-blue-500/20 hover:bg-blue-600/30'}`}
                                                    >
                                                        {copied ? <><Check size={16} /> Copied!</> : <><Copy size={16} /> Copy Address</>}
                                                    </button>
                                                </div>
                                            ) : (
                                                <p className="text-slate-500 text-sm text-center py-4">Wallet address not configured yet. Please contact support.</p>
                                            )}
                                        </>
                                    )}
                                </section>

                                {/* Step 3: Amount */}
                                <section className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                                    <h3 className="text-gray-400 text-xs font-bold mb-4 uppercase tracking-wider">Deposit Amount (USD)</h3>
                                    <div className="bg-[#0b0e14] p-4 rounded-2xl border border-gray-800 flex items-center gap-3 mb-5 focus-within:border-blue-500 transition-colors">
                                        <span className="text-blue-500 text-2xl font-bold">$</span>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className="bg-transparent text-right text-3xl font-black text-white focus:outline-none w-full"
                                            placeholder="0.00"
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['100', '500', '1000', '5000'].map((val) => (
                                            <button key={val} onClick={() => setAmount(val)}
                                                className="bg-gray-800/40 border border-gray-800 text-gray-400 py-3 rounded-xl text-xs font-bold hover:bg-gray-700 hover:text-white transition-all">
                                                ${val}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Step 4: Upload Payment Proof */}
                                <section className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                                    <h3 className="text-gray-400 text-xs font-bold mb-2 uppercase tracking-wider">Upload Payment Proof</h3>
                                    <p className="text-slate-500 text-xs mb-4">Upload a screenshot or receipt of your payment. This is required to process your deposit.</p>

                                    {proofPreview ? (
                                        <div className="relative rounded-2xl overflow-hidden border border-slate-700 mb-4">
                                            <img src={proofPreview} alt="Payment proof" className="w-full max-h-48 object-cover" />
                                            <button
                                                onClick={removeProof}
                                                className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 p-1.5 rounded-lg text-white transition-colors"
                                            >
                                                <X size={14} />
                                            </button>
                                            <div className="bg-green-500/10 border-t border-green-500/20 px-4 py-2">
                                                <p className="text-green-400 text-xs flex items-center gap-2">
                                                    <CheckCircle2 size={14} /> {proofFile?.name}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full py-8 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center gap-3 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group"
                                        >
                                            <div className="bg-slate-800 p-3 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                                                <Upload size={24} className="text-slate-400 group-hover:text-blue-400 transition-colors" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-white text-sm font-semibold">Click to upload</p>
                                                <p className="text-slate-500 text-xs">PNG, JPG, PDF up to 10MB</p>
                                            </div>
                                        </button>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />

                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 mt-4 flex items-start gap-2">
                                        <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                                        <p className="text-amber-400/80 text-xs">Payment cannot be submitted without a valid proof of payment.</p>
                                    </div>
                                </section>

                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
                                        <p className="text-sm text-red-300">{error}</p>
                                    </div>
                                )}

                                <button
                                    onClick={handleSubmit}
                                    disabled={!amount || parseFloat(amount) <= 0 || !proofFile || submitting}
                                    className="w-full bg-[#00a3e0] hover:bg-[#0090c7] disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <><Loader2 size={16} className="animate-spin" /> Submitting...</>
                                    ) : (
                                        'Submit Deposit'
                                    )}
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FundAccountPage;