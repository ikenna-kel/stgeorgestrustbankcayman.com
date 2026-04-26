'use client'

import { Wallet, Check, Copy, Info } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"
import { useState } from "react";


export default function QrPayment() {
    const [copied, setCopied] = useState(false);

    // Mock data
    const usdtAddress = "TV2Mv5n4R9...x8jLp"; // Shortened for display
    const fullAddress = "TV2Mv5n4R9kX8jLp3qZ1yW7mN2bV4c6d8"; // Full address for copy/QR
    const amount = "500";

    const handleCopy = () => {
        navigator.clipboard.writeText(fullAddress);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return <div className="bg-[#151F32] border border-slate-800 rounded-3xl p-8 w-full flex flex-col items-center relative">

        {/* White Background for QR to ensure contrast */}
        <div className="bg-white p-2 rounded-xl mb-6">
            <QRCodeCanvas
                value={fullAddress}
                size={180}
                level={"H"}
                bgColor={"#FFFFFF"}
                fgColor={"#000000"}
            />
        </div>

        <p className="text-slate-400 text-xs mb-4">Scan with your payment app</p>

        <div className="text-center mb-6 space-y-1">
            <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">USDT Address</p>
            <p className="text-slate-300 text-xs font-mono break-all px-4">{usdtAddress}</p>

            <div className="pt-2">
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Amount</p>
                <p className="text-white font-bold text-lg">${amount}</p>
            </div>
        </div>

        {/* Copy Address Field */}
        <div className="w-full space-y-2">
            <div className="flex items-center gap-2 mb-1">
                <Wallet size={14} className="text-blue-400" />
                <span className="text-white font-bold text-sm">USDT Address</span>
            </div>

            <div className="flex items-center gap-2 bg-[#0B1120] rounded-xl p-3 border border-slate-700/50">
                <span className="text-slate-400 text-xs truncate font-mono flex-1">
                    {fullAddress}
                </span>
                <button
                    onClick={handleCopy}
                    className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-white"
                >
                    {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
            </div>

            {/* Network Warning */}
            <div className="flex items-center gap-2 mt-2">
                <Info size={12} className="text-blue-500" />
                <p className="text-[10px] text-slate-400">
                    Network Type: <span className="text-slate-300 font-bold">TRC20</span>
                </p>
            </div>
        </div>

    </div>
}