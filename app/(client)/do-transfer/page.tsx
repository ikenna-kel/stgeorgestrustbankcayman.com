'use client'
import { useEffect, useState } from 'react';
import { Send, RefreshCw, Plus, Users } from 'lucide-react';
import TransferAmountSection from './TransferAmountSection';
import BeneficiaryDetailsForm from './BeneficiaryDetailsForm';
import TransactionSummary from './TransactionSummary';
import AdditionalInfoSection from './AdditionalInfoSection';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import TransferReceiptModal from '@/src/receipts/TransferReceiptModal';
import { TransferReceiptData } from '@/src/receipts/transferReceipt';
import TransactionPinModal from '@/src/components/TransactionPinModal';

type User = {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    accounts: { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string }[];
    cards: { _id: string; type: string; balance: number; lastFourDigits: string }[];
};
type Accounts = { _id: string; accountNumber: string; accountType: string; accountBalance: number; currency: string };

const LocalTransferPage = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    const [toAccount, setToAccount] = useState<User | null>(null);
    const [toAccountError, setToAccountError] = useState<boolean>(false);

    const [amount, setAmount] = useState(0);
    const [transferAmount, setTransferAmount] = useState(0);
    const [error, setError] = useState("false")
    const [loading, setLoading] = useState<boolean>(false)
    const [fromAccountNumber, setFromAccountNumber] = useState<Accounts>()
    const [accountName, setAccountName] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [bankName, setBankName] = useState("")
    const [routingNumber, setRoutingNumber] = useState("")
    const [isInternal, setIsInternal] = useState(true)
    const [receipt, setReceipt] = useState<TransferReceiptData | null>(null)
    const [description, setDescription] = useState("")
    const [showPinModal, setShowPinModal] = useState(false);

    const getUserInfo = async () => {
        try {
            if (!localStorage.getItem("token")) {
                router.push("/login");
                return;
            }
            const res = await api.get("/api/me");
            setUser(res.data);
            setAmount(amount)
            setLoading(false)
        } catch (error) {
            setError(error as any)
        }
    }
    useEffect(() => {
        getUserInfo()
    }, [])


    async function handleSubmit() {
        setLoading(true)
        setError("");
        if (!localStorage.getItem("token")) {
            router.push("/login");
            return;
        }
        setLoading(true);
        console.log({
            fromAccountNumber: fromAccountNumber?.accountNumber,
            toAccountNumber: accountNumber,
            amount: transferAmount,
            type: "local",
            kind: isInternal ? 'internal' : 'external',
            description
        })
        try {
            const tx = await api.post("/api/transfer", {
                fromAccountNumber: fromAccountNumber?.accountNumber,
                toAccountNumber: accountNumber,
                amount: transferAmount,
                type: "local",
                kind: isInternal ? 'internal' : 'external',
                description
            });
            setReceipt({
                transactionId: tx.data?._id ?? `tx-${Date.now()}`,
                createdAt: tx.data?.date ?? new Date().toISOString(),
                fromAccount: fromAccountNumber?.accountNumber ?? "N/A",
                toAccount: accountNumber,
                amount: transferAmount,
                currency: fromAccountNumber?.currency ?? "USD",
                transferType: "local",
                transferKind: isInternal ? "internal" : "external",
                note: description,
                status: tx.data?.status ?? "completed",
            });
            setAccountName("");
            setBankName("");
            setAmount(0);
            setTransferAmount(0);
            setAccountNumber("");
            setDescription("");
        } catch (err) {
            setError(err as string);
        } finally {
            setLoading(false);
        }
    }

    const findAccoutUser = async (
        accountNumber: string) => {
        console.log(accountNumber)
        try {
            const res = await api.get(`/api/accounts/${accountNumber}`)
            setToAccount(res.data)
        } catch (error) {
            setToAccountError(true)
        }


    }

    return (

        <div className="min-h-screen bg-[#0b0e14] text-white font-sans">

            {/* Main Blue Card */}
            <div className="px-2">
                <div className="bg-linear-to-br from-[#00a3e0] to-[#005f87] rounded-xl py-6 px-2 shadow-xl shadow-blue-500/10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                            <Send className="text-white transform -rotate-45" size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Local Transfer</h2>
                            <p className="text-white/70 text-sm">Send money instantly</p>
                        </div>
                    </div>

                    {/* Feature Badges */}
                    <div className="grid grid-cols-3 gap-3">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/5">
                            <p className="text-[10px] text-white/60 flex items-center gap-1 mb-1">
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span> Time
                            </p>
                            <p className="font-bold text-sm">Instant</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/5">
                            <p className="text-[10px] text-white/60 flex items-center gap-1 mb-1">
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span> Fee
                            </p>
                            <p className="font-bold text-sm">Free</p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/5">
                            <p className="text-[10px] text-white/60 flex items-center gap-1 mb-1">
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full"></span> Banks
                            </p>
                            <p className="font-bold text-sm">All Local</p>
                        </div>
                    </div>
                </div>
            </div>


            <div className="px-2 mt-8 pb-10">
                <TransferAmountSection setFromAccountNumber={setFromAccountNumber} fromAccountNumber={fromAccountNumber} userAccounts={user?.accounts ?? []} setTransferAmount={setTransferAmount} transferAmount={transferAmount} />
            </div>

            {/* Bottom Action Button (Optional but common in this UI) */}
            {/* <div className="fixed bottom-8 left-6 right-6">
                <button className="w-full bg-[#00a3e0] py-4 rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-transform">
                    New Transfer
                </button>
            </div> */}




            <div className="px-6 mt-8 pb-10">
                <BeneficiaryDetailsForm findAccoutUser={findAccoutUser} isInternal={isInternal} setIsInternal={setIsInternal} setRoutingNumber={setRoutingNumber} setBankName={setBankName} setAccountNumber={setAccountNumber} setAccountName={setAccountName} />
            </div>

            <div className="px-6 mt-8 pb-10">
                <AdditionalInfoSection setDescription={setDescription} />
            </div>

            <div className="px-6 mt-8 pb-10">
                <TransactionSummary loading={loading} isInternal={isInternal} routingNumber={routingNumber} bankName={bankName} accountNumber={accountNumber} accountName={accountName} transferAmount={transferAmount} onSubmit={() => setShowPinModal(true)} />
            </div>


            <TransferReceiptModal
                open={!!receipt}
                receipt={receipt}
                onClose={() => setReceipt(null)}
                onAnotherTransfer={() => setReceipt(null)}
            />

            <TransactionPinModal
                isOpen={showPinModal}
                onClose={() => setShowPinModal(false)}
                onVerified={() => { setShowPinModal(false); handleSubmit(); }}
                title="Authorize Local Transfer"
            />
        </div>
    );
};

export default LocalTransferPage;