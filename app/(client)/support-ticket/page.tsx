'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LifeBuoy, Send, CheckCircle2, MessageCircle, Clock, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
    'Account Issue',
    'Transaction Problem',
    'Card Issue',
    'Loan Inquiry',
    'Security Concern',
    'Wire Transfer',
    'Deposit Issue',
    'Other',
];

const PRIORITIES = [
    { value: 'low', label: 'Low', color: 'bg-slate-500' },
    { value: 'medium', label: 'Medium', color: 'bg-amber-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' },
];

export default function SupportTicketPage() {
    const router = useRouter();
    const [submitted, setSubmitted] = useState(false);
    const [form, setForm] = useState({
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        // In a real app, this would POST to an API
        setSubmitted(true);
    }

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white font-sans pb-24">
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-b from-indigo-600 to-[#0b0e14] pt-6 pb-6 px-6 rounded-b-[3rem]">

                <div className="flex flex-col items-center text-center">
                    <div className="bg-white/20 p-4 rounded-2xl mb-4 backdrop-blur-md shadow-lg">
                        <LifeBuoy size={32} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Support Ticket</h1>
                    <p className="text-white/70 text-sm max-w-xs">Describe your issue and our team will get back to you as soon as possible.</p>
                </div>
            </div>

            <div className="px-4 sm:px-6 max-w-2xl mx-auto mt-6 space-y-6">
                {submitted ? (
                    <div className="bg-[#1a1d24] border border-green-500/30 rounded-3xl p-8 text-center space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                            <CheckCircle2 size={32} className="text-green-400" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Ticket Submitted!</h2>
                        <p className="text-slate-400 text-sm">
                            Your support ticket has been submitted. Our team will review it and respond within 24-48 hours.
                        </p>
                        <div className="bg-[#0b0e14] rounded-2xl p-4 border border-slate-800 text-left space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Ticket ID</span>
                                <span className="text-white font-mono">TKT-{Math.random().toString(36).substr(2, 8).toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Subject</span>
                                <span className="text-white">{form.subject}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Status</span>
                                <span className="text-amber-400 flex items-center gap-1"><Clock size={12} /> Pending</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => { setSubmitted(false); setForm({ subject: '', category: '', priority: 'medium', message: '' }); }}
                                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl text-sm font-semibold transition-colors">
                                New Ticket
                            </button>
                            <button onClick={() => router.push('/dashboard')}
                                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl text-sm font-semibold transition-colors">
                                Go to Dashboard
                            </button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Info Banner */}
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                            <MessageCircle size={18} className="text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-blue-400/90 text-xs leading-relaxed">
                                Our support team is available 24/7. For urgent matters, please call <span className="font-bold">1-800-000-0000</span>.
                            </p>
                        </div>

                        {/* Subject */}
                        <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Subject</label>
                            <input
                                type="text"
                                placeholder="Briefly describe your issue"
                                value={form.subject}
                                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                required
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Category + Priority */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Category</label>
                                <select
                                    value={form.category}
                                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                    required
                                    className="w-full bg-[#0b0e14] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm appearance-none focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                                >
                                    <option value="">Select category...</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>

                            <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Priority</label>
                                <div className="flex gap-2">
                                    {PRIORITIES.map(p => (
                                        <button
                                            key={p.value}
                                            type="button"
                                            onClick={() => setForm(f => ({ ...f, priority: p.value }))}
                                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border
                                                ${form.priority === p.value
                                                    ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                                                    : 'bg-[#0b0e14] text-slate-400 border-gray-700 hover:border-gray-600'}`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${p.color}`} />
                                            {p.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="bg-[#1a1d24] p-5 rounded-3xl border border-gray-800">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">Message</label>
                            <textarea
                                placeholder="Describe your issue in detail..."
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                required
                                rows={6}
                                className="w-full bg-[#0b0e14] border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-blue-500 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={!form.subject || !form.category || !form.message}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
                        >
                            Submit Ticket
                            <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
