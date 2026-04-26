import { jsPDF } from "jspdf";

export type TransferReceiptData = {
  transactionId: string;
  createdAt: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  currency: string;
  transferType: "local" | "international";
  transferKind: "internal" | "external";
  note?: string;
  status?: string;
};

function formatAmount(currency: string, amount: number) {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

const BANK_NAME = "St. Georges Trust Bank Cayman";
const BANK_WEBSITE = "https://stgeorgestrustbankcayman.com";

async function loadLogoDataUrl() {
  try {
    const response = await fetch("/logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function buildTransferReceiptPdf(data: TransferReceiptData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let y = 18;

  doc.setFillColor(14, 42, 92);
  doc.rect(0, 0, pageWidth, 44, "F");

  const logoDataUrl = await loadLogoDataUrl();
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, "PNG", margin, 8, 26, 26);
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(BANK_NAME, logoDataUrl ? 44 : margin, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(BANK_WEBSITE, logoDataUrl ? 44 : margin, 27);
  doc.setFontSize(16);
  doc.text("TRANSFER RECEIPT", pageWidth - margin, 20, { align: "right" });
  doc.setFontSize(9);
  doc.text(`Issued: ${new Date(data.createdAt).toLocaleString()}`, pageWidth - margin, 27, { align: "right" });

  doc.setTextColor(24, 24, 24);
  y = 56;

  doc.setDrawColor(220, 226, 236);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, "S");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 120, 138);
  doc.text("Status", margin + 4, y + 8);
  doc.text("Transaction ID", margin + 4, y + 18);
  doc.setTextColor(24, 24, 24);
  doc.setFont("helvetica", "bold");
  doc.text((data.status ?? "completed").toUpperCase(), margin + 30, y + 8);
  doc.text(data.transactionId, margin + 30, y + 18);

  const amountText = formatAmount(data.currency, data.amount);
  doc.setTextColor(110, 120, 138);
  doc.setFont("helvetica", "normal");
  doc.text("Amount", pageWidth - margin - 48, y + 8);
  doc.setTextColor(24, 24, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(amountText, pageWidth - margin - 4, y + 8, { align: "right" });
  doc.setFontSize(10);
  doc.setTextColor(110, 120, 138);
  doc.setFont("helvetica", "normal");
  doc.text("Type", pageWidth - margin - 48, y + 18);
  doc.setTextColor(24, 24, 24);
  doc.setFont("helvetica", "bold");
  doc.text(`${data.transferType} (${data.transferKind})`, pageWidth - margin - 4, y + 18, { align: "right" });

  y += 36;
  doc.setTextColor(24, 24, 24);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Transfer Details", margin, y);
  y += 8;

  doc.setDrawColor(232, 236, 243);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFontSize(10);
  const lines: Array<[string, string]> = [
    ["Transaction ID", data.transactionId],
    ["Date", new Date(data.createdAt).toLocaleString()],
    ["Transfer Type", `${data.transferType} (${data.transferKind})`],
    ["From Account", data.fromAccount],
    ["To Account", data.toAccount],
    ["Amount", amountText],
  ];

  if (data.note) {
    lines.push(["Description", data.note]);
  }

  lines.forEach(([label, value]) => {
    doc.setTextColor(110, 120, 138);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin, y);
    doc.setTextColor(24, 24, 24);
    doc.setFont("helvetica", "bold");
    const split = doc.splitTextToSize(String(value), pageWidth - margin * 2 - 58);
    doc.text(split, margin + 58, y);
    y += Math.max(8, split.length * 5);
    doc.setDrawColor(240, 242, 246);
    doc.line(margin, y - 3, pageWidth - margin, y - 3);
  });

  y += 10;
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.setFont("helvetica", "normal");
  doc.text(BANK_NAME, margin, pageHeight - 14);
  doc.text(BANK_WEBSITE, pageWidth - margin, pageHeight - 14, { align: "right" });

  return doc;
}

export async function downloadTransferReceiptPdf(data: TransferReceiptData) {
  const doc = await buildTransferReceiptPdf(data);
  doc.save(`transfer-receipt-${data.transactionId}.pdf`);
}

export async function createTransferReceiptPdfFile(data: TransferReceiptData) {
  const doc = await buildTransferReceiptPdf(data);
  const blob = doc.output("blob");
  return new File([blob], `transfer-receipt-${data.transactionId}.pdf`, {
    type: "application/pdf",
  });
}

