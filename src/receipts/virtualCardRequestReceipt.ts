import { jsPDF } from "jspdf";

export type VirtualCardRequestReceiptData = {
  requestId: string;
  createdAt: string;
  status?: string;
  accountNumber: string;
  accountType: string;
  cardType: "debit" | "credit" | "prepaid";
  description?: string;
  currency: string;
};

const BANK_NAME = "St. Georges trust bank cayman";
const BANK_WEBSITE = "https://stgeorgestrustbankcayman.com";

async function buildLogoDataUrl() {
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

export async function buildVirtualCardRequestPdf(data: VirtualCardRequestReceiptData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  let y = 18;

  doc.setFillColor(14, 42, 92);
  doc.rect(0, 0, pageWidth, 44, "F");

  const logoDataUrl = await buildLogoDataUrl();
  if (logoDataUrl) doc.addImage(logoDataUrl, "PNG", margin, 8, 26, 26);

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(BANK_NAME, logoDataUrl ? 44 : margin, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(BANK_WEBSITE, logoDataUrl ? 44 : margin, 27);

  doc.setFontSize(16);
  doc.text("VIRTUAL CARD REQUEST RECEIPT", pageWidth - margin, 20, { align: "right" });

  doc.setFontSize(9);
  doc.text(`Issued: ${new Date(data.createdAt).toLocaleString()}`, pageWidth - margin, 27, {
    align: "right",
  });

  y = 56;
  doc.setTextColor(24, 24, 24);

  doc.setDrawColor(220, 226, 236);
  doc.roundedRect(margin, y, pageWidth - margin * 2, 26, 2, 2, "S");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(110, 120, 138);
  doc.text("Status", margin + 4, y + 8);
  doc.text("Request ID", margin + 4, y + 18);

  doc.setTextColor(24, 24, 24);
  doc.setFont("helvetica", "bold");
  doc.text(String((data.status ?? "pending").toUpperCase()), margin + 40, y + 8);
  doc.text(data.requestId, margin + 40, y + 18);

  y += 36;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Request Details", margin, y);
  y += 8;
  doc.setDrawColor(232, 236, 243);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const rows: Array<[string, string]> = [
    ["Card Type", data.cardType],
    ["Account", `${data.accountType} • ${data.accountNumber}`],
    ["Currency", data.currency],
  ];
  if (data.description) rows.push(["Description", data.description]);

  rows.forEach(([label, value]) => {
    doc.setTextColor(110, 120, 138);
    doc.setFont("helvetica", "normal");
    doc.text(label, margin, y);

    doc.setTextColor(24, 24, 24);
    doc.setFont("helvetica", "bold");
    const split = doc.splitTextToSize(String(value), pageWidth - margin * 2 - 56);
    doc.text(split, margin + 56, y);
    y += Math.max(8, split.length * 5);
    doc.setDrawColor(240, 242, 246);
    doc.line(margin, y - 3, pageWidth, y - 3);
  });

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 90);
  doc.setFont("helvetica", "normal");
  doc.text(BANK_NAME, margin, pageHeight - 14);
  doc.text(BANK_WEBSITE, pageWidth - margin, pageHeight - 14, { align: "right" });

  return doc;
}

export async function downloadVirtualCardRequestPdf(data: VirtualCardRequestReceiptData) {
  const doc = await buildVirtualCardRequestPdf(data);
  doc.save(`virtual-card-request-${data.requestId}.pdf`);
}

