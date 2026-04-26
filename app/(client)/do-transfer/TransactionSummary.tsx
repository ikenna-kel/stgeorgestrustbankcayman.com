import React from 'react';
import {
    FileText,
    ShieldCheck,
    Eye,
    Bookmark,
    ArrowLeft,
    Lock,
    DatabaseZap,
    Activity,
    ArrowRight
} from 'lucide-react';

const TransactionSummary = ({ loading, isInternal, routingNumber, bankName, accountNumber, accountName, transferAmount, onSubmit }: any) => {

    return (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-10">

            {/* Summary Card */}
            <div className="bg-[#1a1d24] rounded-[2.5rem] p-8 border border-gray-800 shadow-2xl relative overflow-hidden">
                {/* Subtle Decorative Gradient */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl"></div>

                <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-500 p-2 rounded-xl">
                        <FileText size={20} className="text-white" />
                    </div>
                    <h3 className="text-white font-bold text-lg">Transaction Summary</h3>
                </div>

                <div className="space-y-5">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Transfer Amount</span>
                        <span className="text-white font-bold">${transferAmount}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Payment Source</span>
                        <div className="flex items-center gap-2 text-blue-400 font-medium">
                            <div className="bg-blue-400/10 p-1 rounded-md">
                                <ShieldCheck size={12} />
                            </div>
                            Account Balance
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Transfer Fee</span>
                        <span className="text-green-500 font-black text-xs bg-green-500/10 px-2 py-1 rounded-md">FREE</span>
                    </div>

                    <div className="pt-5 border-t border-gray-800/50 flex justify-between items-center">
                        <span className="text-white font-bold">Beneficiary Details</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-gray-500">Account Name</span>
                        <span className="text-gray-300 font-medium">{accountName}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-gray-500">Account Number</span>
                        <span className="text-gray-300 font-medium">{accountNumber}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-gray-500">Rounting Number</span>
                        <span className="text-gray-300 font-medium">{routingNumber}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-gray-500">Bank Name</span>
                        <span className="text-gray-300 font-medium">{bankName}</span>
                    </div>

                    <div className="flex justify-between items-center text-xs pt-2">
                        <span className="text-gray-500">Transfer Type</span>
                        <span className="text-gray-300 font-medium">{isInternal === 'true' ? 'Internal' : 'External'} Transfer</span>
                    </div>


                    <div className="pt-5 border-t border-gray-800/50 flex justify-between items-center">
                        <span className="text-white font-bold">Total Amount</span>
                        <span className="text-[#00a3e0] text-2xl font-black">${transferAmount.toFixed(2)}</span>
                    </div>

                </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={loading}
                        className="w-full bg-[#00a3e0] py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                        {loading ? "Processing…" : "Transfer"}  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-center text-gray-600 text-[10px] mt-4 uppercase tracking-tighter">
                        Securely processed by bank-grade encryption
                    </p>
                </div>

                <button className="w-full bg-[#242831] py-4 rounded-2xl font-bold text-sm text-gray-300 flex items-center justify-center gap-2 border border-gray-700 active:scale-95 transition-all">
                    <Bookmark size={18} /> Save Beneficiary
                </button>

                <button className="w-full py-4 rounded-2xl font-bold text-sm text-gray-500 flex items-center justify-center gap-2 hover:text-white transition-colors">
                    <ArrowLeft size={18} /> Back to Dashboard
                </button>
            </div>

            {/* Security Footer Card */}
            <div className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                <div className="flex items-start gap-4">
                    <div className="bg-green-500/20 p-3 rounded-2xl text-green-500">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="space-y-1">
                        <h4 className="text-white font-bold text-sm">Bank-Level Security</h4>
                        <p className="text-gray-500 text-[10px] leading-relaxed">
                            All transfers are protected with 256-bit SSL encryption. Your financial information is never stored on our servers.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3 mt-6 pt-6 border-t border-gray-800/50">
                    <div className="flex items-center gap-2 text-[10px] text-green-500 font-medium">
                        <Lock size={12} /> SSL Encrypted
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-green-500 font-medium">
                        <DatabaseZap size={12} /> Zero Data Storage
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-green-500 font-medium">
                        <Activity size={12} /> 24/7 Monitoring
                    </div>
                </div>
            </div>

        </div>
    );
};

export default TransactionSummary;