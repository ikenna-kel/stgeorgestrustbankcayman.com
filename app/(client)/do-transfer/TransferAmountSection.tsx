'use client'
import React, { useState } from 'react';
import { Wallet, DollarSign, ArrowRight, Landmark } from 'lucide-react';


const TransferAmountSection = ({ setFromAccountNumber, fromAccountNumber, userAccounts, setTransferAmount, transferAmount }: any) => {

    const quickAmounts = [100, 500, 1000];
    return (

        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Available Balance Card */}
            <div>
                <div className="flex items-center gap-2 mb-3 w-full">
                    <div className="bg-blue-500 p-1.5 rounded-full">
                        <Wallet size={14} className="text-white" />
                    </div>
                    <h3 className="text-white font-bold text-sm">Available Balance</h3>
                </div>
                <div className="w-full overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide flex gap-4 px-1">
                    {userAccounts.map((res: any, index: number) => <div key={index} onClick={() => setFromAccountNumber(res)} className="bg-[#1a1d24] p-5 rounded-xl border border-gray-800">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="bg-blue-600/20 p-2.5 rounded-xl">
                                <Landmark className="text-blue-500" size={20} />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">Account Balance</p>
                                <p className="text-gray-500 text-[10px]">USD Currency</p>
                            </div>
                        </div>

                        <p className="text-white text-3xl font-black mb-1">
                            ${res.accountBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-gray-500 text-[10px]">Available for transfer</p>
                        </div>
                    </div>)

                    }
                </div>
            </div>

            {/* Transfer Amount Input */}
            {fromAccountNumber ?
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-blue-500 p-1.5 rounded-full">
                            <DollarSign size={14} className="text-white" />
                        </div>
                        <h3 className="text-white font-bold text-sm">Transfer Amount</h3>
                    </div>

                    <div className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800">
                        <div className="bg-[#0b0e14] p-4 rounded-2xl border border-gray-800 flex items-center justify-between mb-6">
                            <span className="text-gray-600 text-2xl font-bold">$</span>
                            <input
                                type="text"
                                value={transferAmount}
                                max={fromAccountNumber.accountBalance || 0}
                                onChange={(e) => setTransferAmount(Number(e.target.value))}
                                className="bg-transparent text-right text-2xl font-black text-white focus:outline-none w-full"
                                placeholder="0.00"
                            />
                        </div>

                        <p className="text-gray-500 text-xs font-bold mb-3 uppercase tracking-wider">Quick amounts:</p>
                        <div className="flex gap-2">
                            {quickAmounts.map((val) => (
                                <button
                                    key={val}
                                    onClick={() => setTransferAmount(Number(val.toFixed(2)))}
                                    className="flex-1 bg-gray-800/50 border border-gray-700 text-white py-2.5 rounded-xl text-xs font-bold hover:bg-gray-700 transition-colors"
                                >
                                    ${val}
                                </button>
                            ))}
                            <button
                                onClick={() => setTransferAmount(Number(fromAccountNumber.accountBalance.toFixed(2)))}
                                className="flex-1 bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-lg shadow-blue-500/20"
                            >
                                <Wallet size={12} /> All
                            </button>
                        </div>
                    </div>
                </div> :
                <></>}

        </div>
    );
};

export default TransferAmountSection;