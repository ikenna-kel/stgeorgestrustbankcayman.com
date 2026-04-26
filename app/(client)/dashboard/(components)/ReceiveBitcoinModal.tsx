import React from 'react';
import { X, Copy, AlertTriangle, Share2, Bitcoin } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const ReceiveBitcoinModal = ({ isOpen, onClose }: any) => {
    if (!isOpen) return null;

    const btcAddress = "bc1qna84ynsf3n77qcqg449mpt75k670e3h9uzekn8";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Background Blur */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
                onClick={onClose}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-[#1a1d24] w-full max-w-sm rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">

                {/* Header */}
                <div className="bg-[#00a3e0] p-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-white rounded-full p-1">
                            <Bitcoin size={16} className="text-[#00a3e0]" />
                        </div>
                        <h2 className="text-white font-bold">Receive Bitcoin</h2>
                    </div>
                    <button onClick={onClose} className="bg-white/20 p-1 rounded-full text-white">
                        <X size={18} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 flex flex-col items-center">
                    {/* QR Code Section */}
                    <div className="bg-white p-3 rounded-2xl mb-4">
                        <QRCodeSVG value={btcAddress} size={150} />
                    </div>
                    <p className="text-gray-400 text-xs mb-6">Scan with your Bitcoin wallet</p>

                    {/* Address Field */}
                    <div className="w-full text-left mb-4">
                        <label className="text-gray-400 text-xs block mb-2 font-medium">Bitcoin Address</label>
                        <div className="bg-[#242831] p-3 rounded-xl flex items-center justify-between border border-gray-700">
                            <span className="text-gray-300 text-[10px] break-all mr-2">
                                {btcAddress}
                            </span>
                            <button className="bg-[#00a3e0] p-2 rounded-lg text-white">
                                <Copy size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Warning Message */}
                    <div className="bg-yellow-900/20 border-l-4 border-yellow-500 p-3 w-full flex items-center gap-3 mb-6">
                        <AlertTriangle size={20} className="text-yellow-500 shrink-0" />
                        <p className="text-yellow-500 text-[10px] leading-tight">
                            Only send <span className="font-bold">Bitcoin (BTC)</span> to this address.
                        </p>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-700/50 text-white py-3 rounded-xl font-bold text-sm"
                        >
                            Close
                        </button>
                        <button className="flex-1 bg-[#00a3e0] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                            <Share2 size={16} /> Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReceiveBitcoinModal;