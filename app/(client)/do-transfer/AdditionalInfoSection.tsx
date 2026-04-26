'use client'
import React, { useState } from 'react';
import {
    Info,
    MessageSquare,
    Lock,
    Eye,
    EyeOff,
    ShieldCheck,
    ArrowRight
} from 'lucide-react';

const AdditionalInfoSection = ({ setDescription }: any) => {
    const [showPin, setShowPin] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">

            {/* Section Header */}
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-500 p-1.5 rounded-full">
                    <Info size={14} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-sm">Additional Information</h3>
            </div>

            <div className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800 space-y-6">

                {/* Description / Memo */}
                <div>
                    <label className="text-gray-400 text-xs block mb-3 font-medium">Description/Memo</label>
                    <div className="relative">
                        <MessageSquare className="absolute left-4 top-4 text-gray-600" size={18} />
                        <textarea
                            rows={3}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter transaction description or purpose of payment (optional)"
                            className="w-full bg-[#0b0e14] border border-gray-800 rounded-2xl p-4 pl-12 text-sm text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-700 resize-none"
                        ></textarea>
                    </div>
                </div>

                {/* Transaction PIN */}
                {/* <div>
                    <label className="text-gray-400 text-xs block mb-3 font-medium">Transaction PIN</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                            type={showPin ? "text" : "password"}
                            placeholder="Enter your transaction PIN"
                            className="w-full bg-[#0b0e14] border border-gray-800 rounded-2xl p-4 pl-12 pr-12 text-sm text-white focus:border-blue-500 focus:outline-none transition-all placeholder:text-gray-700 tracking-widest"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPin(!showPin)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors"
                        >
                            {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>

               
                    <div className="flex items-start gap-2 mt-4 px-1">
                        <ShieldCheck size={14} className="text-blue-500 shrink-0 mt-0.5" />
                        <p className="text-gray-500 text-[10px] leading-relaxed italic">
                            This is your <span className="text-blue-400 font-bold">transaction PIN</span>, not your login password. Keep it confidential.
                        </p>
                    </div>
                </div> */}

            </div>

            {/* Final Action Button */}
            {/* <div className="pt-2">
                <button className="w-full bg-[#00a3e0] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                    Authorize Transfer <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-center text-gray-600 text-[10px] mt-4 uppercase tracking-tighter">
                    Securely processed by bank-grade encryption
                </p>
            </div> */}

        </div>
    );
};

export default AdditionalInfoSection;