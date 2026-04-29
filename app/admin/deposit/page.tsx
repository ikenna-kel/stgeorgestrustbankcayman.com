"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import UserSelector from "./UserSelector";
import AccountSelector from "./AccountSelector";
import DepositForm from "./DepositForm";
import { DollarSign, CheckCircle2, ArrowLeft } from "lucide-react";

type Step = "select-user" | "select-account" | "deposit-form" | "success" | "error";

type Account = {
  _id: string;
  accountNumber: string;
  accountType: string;
  accountBalance: number;
  currency: string;
};

type DepositData = {
  userName: string;
  userEmail: string;
  account: Account;
  amount: number;
  operation: "add" | "replace";
};

export default function DepositPage() {
  const [step, setStep] = useState<Step>("select-user");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedUserName, setSelectedUserName] = useState("");
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [depositData, setDepositData] = useState<DepositData | null>(null);

  function handleSelectUser(
    userId: string,
    userName: string,
    userEmail: string
  ) {
    setSelectedUserId(userId);
    setSelectedUserName(userName);
    setSelectedUserEmail(userEmail);
    setStep("select-account");
  }

  function handleSelectAccount(account: Account) {
    setSelectedAccount(account);
    setStep("deposit-form");
  }

  async function handleDepositSubmit(
    amount: number,
    operation: "add" | "replace"
  ) {
    setLoading(true);
    setErrorMsg("");
    try {
      const response = await api.post("/api/admin/deposit", {
        targetUserId: selectedUserId,
        targetAccountId: selectedAccount?._id,
        amount,
        operation,
      });

      setDepositData({
        userName: selectedUserName,
        userEmail: selectedUserEmail,
        account: selectedAccount!,
        amount,
        operation,
      });
      setSuccessMsg(response.data.message || "Deposit created successfully");
      setStep("success");
    } catch (err: any) {
      setErrorMsg(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to create deposit"
      );
      setStep("error");
    } finally {
      setLoading(false);
    }
  }

  function resetFlow() {
    setStep("select-user");
    setSelectedUserId("");
    setSelectedUserName("");
    setSelectedUserEmail("");
    setSelectedAccount(null);
    setErrorMsg("");
    setSuccessMsg("");
    setDepositData(null);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Deposit Funds</h1>
        <p className="text-slate-500 text-sm">
          Deposit funds into user accounts and send confirmation emails
        </p>
      </div>

      {/* Progress Indicator */}
      {step !== "success" && step !== "error" && (
        <div className="flex items-center gap-2 text-xs">
          {["select-user", "select-account", "deposit-form"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  step === s
                    ? "bg-blue-400"
                    : ["select-user", "select-account", "deposit-form"].indexOf(
                        step
                      ) > i
                    ? "bg-green-400"
                    : "bg-slate-700"
                }`}
              />
              {i < 2 && (
                <div
                  className={`w-3 h-0.5 transition-colors ${
                    ["select-user", "select-account", "deposit-form"].indexOf(
                      step
                    ) > i
                      ? "bg-green-400"
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
          <span className="ml-2 text-slate-500">
            Step {
              ["select-user", "select-account", "deposit-form"].indexOf(
                step
              ) + 1
            }{" "}
            of 3
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8">
        {/* Select User */}
        {step === "select-user" && (
          <UserSelector onSelect={handleSelectUser} />
        )}

        {/* Select Account */}
        {step === "select-account" && selectedAccount === null && (
          <AccountSelector
            userId={selectedUserId}
            userName={selectedUserName}
            onSelect={handleSelectAccount}
            onBack={() => setStep("select-user")}
          />
        )}

        {/* Deposit Form */}
        {step === "deposit-form" && selectedAccount && (
          <DepositForm
            account={selectedAccount}
            userName={selectedUserName}
            onSubmit={handleDepositSubmit}
            onBack={() => setStep("select-account")}
            loading={loading}
          />
        )}

        {/* Success */}
        {step === "success" && depositData && (
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-green-400" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Deposit Successful
              </h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                Funds have been deposited and confirmation email sent to{" "}
                <span className="text-white font-medium">
                  {depositData.userEmail}
                </span>
              </p>
            </div>

            {/* Summary */}
            <div className="bg-slate-900/60 border border-slate-700/60 rounded-2xl p-6 text-left space-y-3 max-w-sm mx-auto">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">User</span>
                <span className="text-white font-medium">
                  {depositData.userName}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Account</span>
                <span className="text-white font-mono text-xs">
                  {depositData.account.accountNumber}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-700/60">
                <span className="text-slate-500">Amount</span>
                <span className="text-white font-bold">
                  {depositData.account.currency}{" "}
                  {depositData.amount.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Operation</span>
                <span className="text-white font-medium capitalize">
                  {depositData.operation === "add" ? "Added to" : "Set to"}{" "}
                  balance
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={resetFlow}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <DollarSign size={16} />
                New Deposit
              </button>
              <a
                href="/admin/transactions"
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <ArrowLeft size={16} />
                View Transactions
              </a>
            </div>
          </div>
        )}

        {/* Error */}
        {step === "error" && (
          <div className="text-center space-y-6 py-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <div className="text-3xl">⚠️</div>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Deposit Failed
              </h2>
              <p className="text-red-400 text-sm max-w-sm mx-auto">{errorMsg}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center pt-4">
              <button
                onClick={() => setStep("deposit-form")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition-all"
              >
                Try Again
              </button>
              <button
                onClick={resetFlow}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-6 py-3 rounded-xl font-semibold transition-all"
              >
                <ArrowLeft size={16} />
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
