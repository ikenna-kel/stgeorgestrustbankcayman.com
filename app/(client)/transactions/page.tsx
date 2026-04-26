'use client'
import { useState, useEffect } from 'react';
import AccountCarousel from './AccountCarousel';
import TransactionList from './transactionList';
import { api } from '@/lib/api';
import { Search, Download, X } from 'lucide-react';

const HistoryPage = () => {
    // State
    const [selectedAccount, setSelectedAccount] = useState(null); // null = All
    const [transactions, setTransactions] = useState<any[]>([]);
    const [accounts, setAccounts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');



    // Helper array of just IDs for checking ownership
    const myAccountNumbers = accounts.map(a => a.accountNumber);

    const LIMIT = 10;

    const fetchTransactions = async (reset = false) => {
        setLoading(true);
        try {
            const currentSkip = reset ? 0 : skip;

            // Build Query Params
            const params = new URLSearchParams({
                limit: LIMIT.toString(),
                skip: currentSkip.toString(),
            });
            if (selectedAccount) {
                params.append("accountNumber", selectedAccount);
            }

            const res_accounts = await api.get(`/api/accounts`);
            const response = await api.get(`/api/transactions?${params.toString()}`);
            const data = await response.data;

            setAccounts(res_accounts.data);
            if (reset) {
                setTransactions(data);
            } else {
                setTransactions((prev: any) => [...prev, ...data]);
            }

            // Logic to determine if we reached the end
            if (data.length < LIMIT) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            // Update skip for next time
            setSkip(currentSkip + LIMIT);

        } catch (error) {
            console.error("Failed to fetch", error);
        } finally {
            setLoading(false);
        }
    };

    // 1. Initial Load & When Account Changes
    useEffect(() => {
        setSkip(0);
        setHasMore(true);
        fetchTransactions(true); // true = reset list
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedAccount]);

    // 2. Load More Handler
    const handleLoadMore = () => {
        if (!loading && hasMore) {
            fetchTransactions(false); // false = append to list
        }
    };

    // Filter transactions by search query
    const filteredTransactions = transactions.filter(tx => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
            (tx.description || '').toLowerCase().includes(q) ||
            (tx.fromAccount || '').toLowerCase().includes(q) ||
            (tx.toAccount || '').toLowerCase().includes(q) ||
            (tx.type || '').toLowerCase().includes(q) ||
            (tx.status || '').toLowerCase().includes(q) ||
            String(tx.amount || '').includes(q)
        );
    });

    // Export CSV
    function handleExport() {
        const headers = ['Date', 'From', 'To', 'Amount', 'Currency', 'Type', 'Status', 'Description'];
        const rows = filteredTransactions.map(tx => [
            new Date(tx.date).toLocaleString(),
            tx.fromAccount,
            tx.toAccount,
            tx.amount,
            tx.currency || 'USD',
            tx.type,
            tx.status,
            tx.description || ''
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.map((c: any) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    }

    return (
        <div className="min-h-screen bg-[#0F172A] p-4 sm:p-6 lg:p-8 text-white font-sans max-w-7xl mx-auto">

            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-1">Transactions</h1>
                    <p className="text-slate-400 text-sm">View your financial activity</p>
                </div>
                <button
                    onClick={handleExport}
                    disabled={filteredTransactions.length === 0}
                    className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0"
                >
                    <Download size={16} />
                    Export CSV
                </button>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative max-w-xl">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by description, account, type, status..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#1a2236] border border-slate-700/60 rounded-xl pl-11 pr-10 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all"
                    />
                    {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                            <X size={16} />
                        </button>
                    )}
                </div>
                {searchQuery && (
                    <p className="text-slate-500 text-xs mt-2 ml-1">
                        Showing {filteredTransactions.length} of {transactions.length} transactions
                    </p>
                )}
            </div>

            {/* Account Selector */}
            <div className="mb-6">
                <AccountCarousel
                    accounts={accounts}
                    selectedAccount={selectedAccount}
                    onSelect={setSelectedAccount}
                />
            </div>

            {/* Transaction Feed */}
            <TransactionList
                transactions={filteredTransactions}
                loading={loading}
                hasMore={hasMore && !searchQuery}
                onLoadMore={handleLoadMore}
                selectedAccount={selectedAccount}
            />
        </div>
    );
};

export default HistoryPage;