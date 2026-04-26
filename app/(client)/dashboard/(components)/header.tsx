import { Settings2, BellIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { X, Bell } from "lucide-react";

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accounts: { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string }[];
    cards: { _id: string; type: string; balance: number; lastFourDigits: string }[];
}
export default function ClientHead({ user }: { user: User }) {
    const [notifOpen, setNotifOpen] = useState(false);

    return <>
        <div className="flex justify-between items-center pt-3 md:pt-5">
            <div className="flex items-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-400 flex justify-center items-center rounded-full text-lg md:text-xl font-bold">
                    {user.firstName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="flex flex-col ml-2 md:ml-3 text-gray-300">
                    <p className="font-thin text-base md:text-xl">Good Morning</p>
                    <p className="text-xs md:text-sm">{user.firstName} {user.lastName}</p>
                </div>
            </div>
            <div className="flex gap-2 md:gap-3">
                <Link href="/settings" className="flex w-8 h-8 md:w-10 md:h-10 justify-center items-center bg-blue-900 text-gray-200 text-xs rounded-full hover:bg-blue-800 transition-colors">
                    <Settings2 className="size-4 md:size-5" />
                </Link>
                <button
                    onClick={() => setNotifOpen(true)}
                    className="flex w-8 h-8 md:w-10 md:h-10 justify-center items-center bg-blue-900 text-gray-200 text-xs rounded-full hover:bg-blue-800 transition-colors"
                >
                    <BellIcon className="size-4 md:size-5" />
                </button>
            </div>
        </div>

        {/* Notification Modal */}
        {notifOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setNotifOpen(false)} />
                <div className="relative bg-[#1a2540] border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-center">
                    <button onClick={() => setNotifOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                        <X size={20} />
                    </button>
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Bell size={28} className="text-blue-400" />
                    </div>
                    <h3 className="text-white font-bold text-lg mb-2">Notifications</h3>
                    <p className="text-slate-400 text-sm">No Notifications At This Time</p>
                </div>
            </div>
        )}
    </>;
}