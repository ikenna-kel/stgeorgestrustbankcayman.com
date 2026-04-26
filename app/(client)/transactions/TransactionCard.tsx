import React from 'react';
import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';

const TransactionCard = ({ transaction, currentUserId, selectedAccount }: any) => {

    
    return (
        <div className="bg-[#1a1d24] p-4 rounded-2xl flex items-center justify-between border border-slate-800/60 hover:border-slate-700 transition-colors mb-3">
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${transaction.toAccount == selectedAccount ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    {transaction.toAccount == selectedAccount ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                    <p className="font-bold text-white text-sm">

                        {transaction.toAccount == selectedAccount ? 'Deposit' : 'Withdrawal'}
                    </p>
                    <p className="text-slate-500 text-xs">
                        {new Date(transaction.date).toLocaleDateString()} • {new Date(transaction.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
            </div>
            <div className="text-right">
                <button className="text-blue-400 text-xs mb-1 hover:underline">View Details</button>
                <p className={`font-bold ${transaction.toAccount == selectedAccount ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.toAccount == selectedAccount ? '+' : '-'}${transaction.amount?.toFixed(2)}
                </p>
            </div>
        </div>
    );
};

export default TransactionCard;