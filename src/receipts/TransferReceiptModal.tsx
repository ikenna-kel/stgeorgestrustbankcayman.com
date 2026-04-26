"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Download, Share2, Mail, MessageCircle, X } from "lucide-react";
import {
  TransferReceiptData,
  createTransferReceiptPdfFile,
  downloadTransferReceiptPdf,
} from "./transferReceipt";

type Props = {
  open: boolean;
  receipt: TransferReceiptData | null;
  onClose: () => void;
  onAnotherTransfer?: () => void;
};

function formatAmount(currency: string, amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export default function TransferReceiptModal({ open, receipt, onClose, onAnotherTransfer }: Props) {
  const [sharing, setSharing] = useState(false);

  const formattedAmount = useMemo(() => {
    if (!receipt) return "";
    return formatAmount(receipt.currency, receipt.amount);
  }, [receipt]);

  if (!open || !receipt) return null;

  const message = `Transfer receipt ${receipt.transactionId}\nAmount: ${formattedAmount}\nFrom: ${receipt.fromAccount}\nTo: ${receipt.toAccount}\nDate: ${new Date(receipt.createdAt).toLocaleString()}`;

  async function handleSharePdf() {
    if (!receipt) return;
    setSharing(true);
    try {
      const file = await createTransferReceiptPdfFile(receipt);
      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: "Transfer Receipt",
          text: "Transfer receipt attached as PDF.",
          files: [file],
        });
      } else {
        // Fallback when file sharing is unsupported.
        await downloadTransferReceiptPdf(receipt);
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
      }
    } catch {
      // Ignore cancelled share interactions.
    } finally {
      setSharing(false);
    }
  }

  async function handleEmailFallback() {
    if (!receipt) return;
    const subject = encodeURIComponent(`Transfer Receipt ${receipt.transactionId}`);
    const body = encodeURIComponent(`${message}\n\nPDF will be downloaded to attach manually.`);
    await downloadTransferReceiptPdf(receipt);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-green-500/20 bg-[#1a1d24] p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle2 className="text-green-400" size={30} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Close receipt"
          >
            <X size={16} />
          </button>
        </div>

        <h2 className="mt-4 text-xl font-bold">Transfer Successful</h2>
        <p className="mt-2 text-sm text-slate-400">
          Receipt generated for <span className="text-white font-semibold">{formattedAmount}</span>
        </p>

        <div className="mt-5 space-y-2 rounded-2xl bg-[#0b0e14] p-4 border border-slate-800 text-sm">
          <p><span className="text-slate-400">Transaction:</span> {receipt.transactionId}</p>
          <p><span className="text-slate-400">From:</span> {receipt.fromAccount}</p>
          <p><span className="text-slate-400">To:</span> {receipt.toAccount}</p>
          <p><span className="text-slate-400">Date:</span> {new Date(receipt.createdAt).toLocaleString()}</p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3">
          <button
            type="button"
            onClick={() => void downloadTransferReceiptPdf(receipt)}
            className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Download size={16} /> Download PDF
          </button>
          <button
            type="button"
            onClick={handleSharePdf}
            disabled={sharing}
            className="w-full py-3 rounded-2xl bg-slate-700 hover:bg-slate-600 disabled:opacity-50 font-semibold text-sm flex items-center justify-center gap-2"
          >
            <Share2 size={16} /> {sharing ? "Preparing..." : "Share PDF (WhatsApp, Email, Others)"}
          </button>
          <button
            type="button"
            onClick={() => void handleEmailFallback()}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700"
          >
            <Mail size={16} /> Email PDF
          </button>
          <button
            type="button"
            onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer")}
            className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 font-semibold text-sm flex items-center justify-center gap-2 border border-slate-700"
          >
            <MessageCircle size={16} /> WhatsApp (with receipt details)
          </button>
        </div>

        {onAnotherTransfer ? (
          <button
            type="button"
            onClick={onAnotherTransfer}
            className="mt-4 w-full py-3 rounded-2xl bg-transparent border border-slate-600 hover:border-slate-400 text-sm font-semibold"
          >
            Send Another Transfer
          </button>
        ) : null}
      </div>
    </div>
  );
}

