import React from 'react';
import { X, Users, Globe, Zap, Gift, Shield, Clock, Info, Send } from 'lucide-react';
import Link from 'next/link';

const SendMoneyModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Flou d'arrière-plan (Background Blur) */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>

            <div className="relative bg-[#1a1d24] w-full max-w-sm rounded-3xl p-6 border border-gray-800 shadow-2xl text-center">
                {/* Close Button */}
                <button onClick={onClose} className="absolute right-4 top-4 bg-gray-800/50 p-1 rounded-full text-gray-400">
                    <X size={18} />
                </button>

                {/* Icon & Title */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-4">
                        <div className="bg-blue-500 p-4 rounded-2xl shadow-lg shadow-blue-500/20">
                            <Send className="text-white transform -rotate-45" size={32} />
                        </div>
                        {/* Decorative dots from the image */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1a1d24]"></div>
                        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-yellow-500 rounded-full border border-[#1a1d24]"></div>
                    </div>
                    <h2 className="text-white text-xl font-bold">Send Money</h2>
                    <p className="text-gray-500 text-xs mt-1">Swift & Secure Money Transfer</p>
                </div>

                {/* Transfer Options */}
                <div className="space-y-4 mb-6">
                    {/* Local Transfer */}
                    <Link href={'do-transfer'} className="w-full bg-[#242831] p-4 rounded-2xl border border-gray-700 flex items-center gap-4 hover:border-blue-500 transition-colors group">
                        <div className="bg-blue-500/20 p-3 rounded-xl text-blue-400">
                            <Users size={24} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-bold text-sm">Local Transfer</p>
                            <p className="text-gray-500 text-[10px]">Send money to local accounts Instantly</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-green-900/30 text-green-500 text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Zap size={10} /> Instant
                                </span>
                                <span className="bg-blue-900/30 text-blue-400 text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Gift size={10} /> 0% Fee
                                </span>
                            </div>
                        </div>
                        <div className="text-gray-600 group-hover:text-white">→</div>
                    </Link>

                    {/* International Wire */}
                    <Link href={'/international-transfer'} className="w-full bg-[#242831] p-4 rounded-2xl border border-gray-700 flex items-center gap-4 hover:border-blue-500 transition-colors group">
                        <div className="bg-blue-500 p-3 rounded-xl text-blue-500">
                            <Globe size={24} />
                        </div>
                        <div className="flex-1 text-left">
                            <p className="text-white font-bold text-sm">International Wire</p>
                            <p className="text-gray-500 text-[10px]">Global transfers within 72 hours</p>
                            <div className="flex gap-2 mt-2">
                                <span className="bg-blue-900/30 text-blue-400 text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Shield size={10} /> Secure
                                </span>
                                <span className="bg-orange-900/30 text-orange-400 text-[9px] px-2 py-0.5 rounded-md flex items-center gap-1">
                                    <Clock size={10} /> 72hrs
                                </span>
                            </div>
                        </div>
                        <div className="text-gray-600 group-hover:text-white">→</div>
                    </Link>
                </div>

                {/* Security Info */}
                <div className="bg-gray-800/30 p-4 rounded-2xl flex items-start gap-3 mb-6">
                    <Info size={16} className="text-gray-500 shrink-0 mt-0.5" />
                    <p className="text-gray-500 text-[10px] text-left leading-relaxed">
                        All transfers are protected by bank-grade encryption and require verification for your security.
                    </p>
                </div>

                <button onClick={onClose} className="w-full bg-gray-800 text-white py-3 rounded-xl font-bold text-sm">
                    Close
                </button>
            </div>
        </div>
    );
};

export default SendMoneyModal;