import React from 'react';
import { CreditCard, Wallet } from 'lucide-react';

const AccountCarousel = ({ accounts, selectedAccount, onSelect }: any) => {
    return (
        <div className="w-full overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide flex gap-4 px-1">
            {/* "All Accounts" Option */}
            <div
                onClick={() => onSelect(null)}
                className={`snap-center shrink-0 w-40 h-25 rounded-2xl p-4 flex flex-col justify-between cursor-pointer border transition-all duration-300
          ${!selectedAccount
                        ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/20'
                        : 'bg-[#1a1d24] border-slate-800 text-slate-400 hover:border-slate-600'}`}
            >
                <div className="flex justify-between items-start">
                    <Wallet size={20} className={!selectedAccount ? 'text-white' : 'text-slate-500'} />
                    {!selectedAccount && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className={`text-sm font-bold ${!selectedAccount ? 'text-white' : 'text-slate-300'}`}>All Wallets</span>
            </div>

            {/* Individual Accounts */}
            {accounts.map((acc: any) => {
                const isSelected = selectedAccount === acc.accountNumber;
                return (
                    <div
                        key={acc.accountNumber}
                        onClick={() => onSelect(acc.accountNumber)}
                        className={`snap-center shrink-0 w-40 h-25 rounded-2xl p-4 flex flex-col justify-between cursor-pointer border transition-all duration-300
              ${isSelected
                                ? 'bg-emerald-600 border-emerald-400 shadow-lg shadow-emerald-900/20'
                                : 'bg-[#1a1d24] border-slate-800 text-slate-400 hover:border-slate-600'}`}
                    >
                        <div className="flex justify-between items-start">
                            <CreditCard size={20} className={isSelected ? 'text-white' : 'text-slate-500'} />
                            {isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}
                        </div>
                        <div>
                            <p className={`text-xs ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>{acc.accountType}</p>
                            <p className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                                {acc.accountNumber}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default AccountCarousel;