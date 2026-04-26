import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { SiteSettings } from "@/lib/models";

// Public endpoint — no auth required — returns only deposit/contact settings
const PUBLIC_KEYS = [
    "btcWallet",
    "ethWallet",
    "usdtWallet",
    "bankName",
    "bankAccountNumber",
    "bankAccountName",
    "bankRoutingNumber",
    "bankSwiftCode",
    "bankBeneficiary",
    "paypalEmail",
    "supportEmail",
    "helpPhone",
    "siteName",
];

export async function GET() {
    try {
        await connectDB();
        const docs = await SiteSettings.find({ key: { $in: PUBLIC_KEYS } }).lean();
        const map: Record<string, unknown> = {};
        for (const d of docs) map[d.key] = d.value;
        return NextResponse.json(map);
    } catch (e) {
        console.error("Public settings error:", e);
        return NextResponse.json({ error: "Failed" }, { status: 500 });
    }
}
