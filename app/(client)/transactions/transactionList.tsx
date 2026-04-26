'use client'
import TransactionCard from './TransactionCard';
import { Loader2 } from 'lucide-react';

const TransactionList = ({ transactions, loading, hasMore, onLoadMore, selectedAccount }: any) => {

    return (
        <div className="flex-1 overflow-y-auto mt-4 pb-20">
            <h3 className="text-white font-bold text-lg mb-4 sticky top-0 bg-[#0F172A] py-2 z-10">History</h3>

            {transactions.length === 0 && !loading ? (
                <div className="text-center py-10 text-slate-500">
                    <p>No transactions found.</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {transactions.map((tx: { _id: any; }, index: any) => (
                        <TransactionCard
                            key={tx._id || index}
                            transaction={tx}
                            selectedAccount={selectedAccount}
                        />
                    ))}
                </div>
            )}

            {/* Load More / Loading State */}
            <div className="py-6 text-center">
                {loading ? (
                    <div className="flex justify-center items-center gap-2 text-blue-400">
                        <Loader2 className="animate-spin" size={20} />
                        <span className="text-sm">Loading...</span>
                    </div>
                ) : hasMore ? (
                    <button
                        onClick={onLoadMore}
                        className="text-sm text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-full"
                    >
                        Load More
                    </button>
                ) : transactions.length > 0 ? (
                    <p className="text-xs text-slate-600 uppercase tracking-widest font-semibold">No more transactions</p>
                ) : null}
            </div>
        </div>
    );
};

export default TransactionList;