'use client'
import React, { useState } from 'react';
import { Landmark, Bitcoin, CreditCard, Send, PlusCircle, ArrowLeft, Settings, Bell } from 'lucide-react';
import MethodCard from './MethodCard';
import TransferModal from './TransferModal';

// 1. Define the interface for your method
interface TransferMethod {
    id: string;
    title: string;
    desc: string;
    icon: any; // You can use LucideIcon if you want to be specific
}

const InternationalTransfer = () => {
    const [selectedMethod, setSelectedMethod] = useState<TransferMethod | null>(null);

    const methods = [
        { id: 'wire', title: 'Wire Transfer', desc: 'Transfer funds directly to international bank accounts', icon: Landmark },
        { id: 'crypto', title: 'Cryptocurrency', desc: 'Send funds to your cryptocurrency wallet', icon: Bitcoin },
        { id: 'paypal', title: 'PayPal', desc: 'Transfer to your PayPal account', icon: CreditCard },
        { id: 'wise', title: 'Wise Transfer', desc: 'Transfer with lower fees using Wise', icon: Send },
        { id: 'cashapp', title: 'Cash App', desc: 'Quick transfer to your Cash App account', icon: CreditCard },
        { id: 'more', title: 'More Options', desc: 'Zelle, Venmo, Revolut and more', icon: PlusCircle },
    ];

    return (
        <div className="min-h-screen bg-[#0b0e14] text-white p-6 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <button className="bg-gray-800/50 p-2 rounded-lg"><ArrowLeft size={20} /></button>
                    <h1 className="text-xl font-bold">International Transfer</h1>
                </div>
                <div className="flex gap-3">
                    <button className="text-yellow-500"><Settings size={20} /></button>
                    <div className="relative">
                        <Bell size={20} />
                        <span className="absolute -top-1 -right-1 bg-red-500 text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">4</span>
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Select Transfer Method</h3>

            <div className="space-y-3">
                {methods.map((m) => (
                    <MethodCard key={m.id} {...m} onClick={() => setSelectedMethod(m)} />
                ))}
            </div>

            {/* Modal Integration */}
            {selectedMethod && (
                <TransferModal
                    method={selectedMethod}
                    onClose={() => setSelectedMethod(null)}
                />
            )}
        </div>
    );
};

export default InternationalTransfer;