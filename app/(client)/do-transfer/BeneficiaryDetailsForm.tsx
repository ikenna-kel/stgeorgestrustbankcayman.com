import React from 'react';
import { User, Hash, Landmark, CreditCard, LocateFixed, Globe, ArrowRight } from 'lucide-react';

const BeneficiaryDetailsForm = ({ findAccoutUser, isInternal, setIsInternal, setRoutingNumber, setBankName, setAccountNumber, setAccountName }: any) => {


    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">



            {/* Header Label */}
            <div className="flex items-center gap-2 mb-2">
                <div className="bg-blue-500 p-1.5 rounded-full">
                    <User size={14} className="text-white" />
                </div>
                <h3 className="text-white font-bold text-sm">Beneficiary Details</h3>
            </div>

            <div className="bg-[#1a1d24] p-6 rounded-3xl border border-gray-800 space-y-5">

                {/* Account Type (Dropdown) */}
                <div>
                    <label className="text-gray-400 text-xs block mb-2 font-medium">Account Type</label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <select onChange={(e) => {
                            const value = e.target.value;
                            value === "true" ? setIsInternal(true) : setIsInternal(false)
                        }} className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 pl-12 text-sm text-white focus:border-blue-500 focus:outline-none appearance-none transition-colors">
                            <option value={"true"}>Internal Transfer</option>
                            <option value={"false"}>External Transfer</option>
                        </select>
                    </div>
                </div>

                {/* Account Number */}
                <div>
                    <label className="text-gray-400 text-xs block mb-2 font-medium">Account Number</label>
                    <div className="relative">
                        <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                        <input
                            onChange={(e) => setAccountNumber(e.target.value)}
                            onBlur={(e) => { findAccoutUser(e.target.value) }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Enter account number"
                            className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 pl-12 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-700"
                        />
                    </div>
                </div>

                {isInternal ?
                    <></> :
                    <>
                        {/* Account Holder Name */}
                        <div>
                            <label className="text-gray-400 text-xs block mb-2 font-medium">Account Holder Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    onChange={(e) => setAccountName(e.target.value)}
                                    disabled={isInternal == 'true'}
                                    type="text"
                                    placeholder="Enter full name as on bank account"
                                    className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 pl-12 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                />
                            </div>
                        </div>



                        {/* Bank Name */}
                        <div>
                            <label className="text-gray-400 text-xs block mb-2 font-medium">Bank Name</label>
                            <div className="relative">
                                <Landmark className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    onChange={(e) => setBankName(e.target.value)}
                                    disabled={isInternal == 'true'}
                                    type="text"
                                    placeholder="Enter bank name"
                                    className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 pl-12 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                />
                            </div>
                        </div>



                        {/* Routing Number */}
                        <div>
                            <label className="text-gray-400 text-xs block mb-2 font-medium">Routing Number</label>
                            <div className="relative">
                                <LocateFixed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                <input
                                    onChange={(e) => setRoutingNumber(e.target.value)}
                                    disabled={isInternal == 'true'}
                                    type="text"
                                    placeholder="Enter 9-digit routing number"
                                    className="w-full bg-[#0b0e14] border border-gray-800 rounded-xl p-4 pl-12 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors placeholder:text-gray-700"
                                />
                            </div>
                            <p className="text-[#00a3e0] text-[10px] mt-2 italic">9-digit number found on your checks</p>
                        </div>
                    </>
                }


            </div>
        </div >
    );
};

export default BeneficiaryDetailsForm;