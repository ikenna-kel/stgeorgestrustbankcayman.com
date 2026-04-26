import { ArrowLeft, Settings, Bell, CreditCard, Info } from 'lucide-react';
import QrPayment from './qr-payment';

const MakePayment = () => {

    return (

        <div className="w-full bg-[#0F172A] h-200  border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col">

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-6 z-20">
                <button className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="text-slate-300" size={24} />
                </button>
                <h1 className="text-white font-bold text-lg tracking-wide">Make Payment</h1>
                <div className="flex gap-4">
                    <Settings className="text-yellow-400" size={22} />
                    <div className="relative">
                        <Bell className="text-white" size={22} />
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">4</div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-5 space-y-6 flex-1 overflow-y-auto pb-6">

                {/* Main Blue Card */}
                <div className="relative bg-linear-to-br from-[#06b6d4] to-[#0284c7] rounded-3xl p-6 text-white shadow-lg overflow-hidden">
                    {/* Background Decorations */}
                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl"></div>

                    <div className="relative z-10">
                        {/* Card Header */}
                        <div className="flex items-center gap-3 mb-2">
                            <CreditCard size={26} className="text-white fill-white/20" />
                            <h2 className="text-xl font-bold">Payment Method: USDT</h2>
                        </div>
                        <p className="text-cyan-50 text-xs mb-8 opacity-90">
                            Secure payment processing for your deposit
                        </p>

                        {/* Amount Box (Glassmorphism) */}
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-sm">
                            <div className="text-cyan-50 text-xs font-medium mb-1 opacity-80">Amount</div>
                            <div className="text-2xl font-bold text-white tracking-tight">$500 USD</div>
                        </div>
                    </div>
                </div>

                {/* Instructions Card */}
                <div className="bg-[#151F32] rounded-2xl p-6 border border-slate-800/60 shadow-md">
                    <div className="flex gap-4">
                        <div className="mt-0.5 shrink-0">
                            <Info size={20} className="text-blue-400 fill-blue-400/10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-white font-bold text-sm">Payment Instructions</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                You are to make payment of <span className="text-white font-bold">$500</span> using
                                your selected payment method. Screenshot and upload the proof of payment.
                            </p>
                        </div>
                    </div>
                </div>

                {/* The QR Card */}
                <QrPayment />
            </div>

            {/* Upload Placeholder (Optional, implied by instructions) */}
            <button className="w-full bg-slate-800/50 hover:bg-slate-800 border-2 border-dashed border-slate-700 text-slate-400 py-8 rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors group mt-2">
                <div className="bg-slate-700/50 p-3 rounded-full group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                </div>
                <span className="text-sm font-medium">Upload Proof</span>
            </button>

        </div>

    );
};

export default MakePayment;