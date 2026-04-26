'use client';
import { useState } from 'react';
import { ShieldCheck, X, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

interface TransactionPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  title?: string;
}

export default function TransactionPinModal({ isOpen, onClose, onVerified, title }: TransactionPinModalProps) {
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/api/auth/verify-pin', { pin, type: 'transaction' });
      setPin('');
      onVerified();
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Invalid PIN');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setPin(''); setError(''); onClose(); }} />
      <div className="relative bg-[#0f1219] border border-slate-700/60 rounded-3xl w-full max-w-sm p-6 shadow-2xl">
        <button onClick={() => { setPin(''); setError(''); onClose(); }} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={28} className="text-emerald-400" />
          </div>
          <h3 className="text-white font-bold text-lg">{title || 'Transaction PIN'}</h3>
          <p className="text-slate-400 text-xs mt-1">Enter your 4-digit PIN to authorize</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            inputMode="numeric"
            maxLength={4}
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="••••"
            autoFocus
            className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-4 text-white text-center text-3xl font-mono tracking-[0.8em] placeholder:text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading || pin.length !== 4}
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3.5 rounded-full font-bold text-sm transition-all flex items-center justify-center gap-2"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" /> Verifying…</> : 'Authorize Transaction'}
          </button>
        </form>
      </div>
    </div>
  );
}
