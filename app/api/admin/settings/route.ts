import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SiteSettings, DEFAULT_SITE_KEYS } from "@/lib/models";
import { withAdmin } from "@/lib/api-middleware";

const SetSchema = z.object({
  key: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.unknown()), z.array(z.unknown())]),
});

const SetManySchema = z.object({
  settings: z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.record(z.string(), z.unknown()), z.array(z.unknown())])),
});

export const GET = withAdmin(async (req, ctx) => {
  try {
    const all = await SiteSettings.find().lean();
    const map: Record<string, unknown> = {};
    for (const s of all) map[s.key] = s.value;
    return NextResponse.json({ settings: map, keys: Object.values(DEFAULT_SITE_KEYS) });
  } catch (e) {
    console.error("Admin get settings error:", e);
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 });
  }
});

export const POST = withAdmin(async (req, ctx) => {
  try {
    const body = await req.json();
    const one = SetSchema.safeParse(body);
    if (one.success) {
      const doc = await SiteSettings.findOneAndUpdate(
        { key: one.data.key },
        { $set: { value: one.data.value } },
        { upsert: true, new: true }
      ).lean();
      return NextResponse.json(doc);
    }
    const many = SetManySchema.safeParse(body);
    if (many.success) {
      const results: unknown[] = [];
      for (const [key, value] of Object.entries(many.data.settings)) {
        const doc = await SiteSettings.findOneAndUpdate(
          { key },
          { $set: { value } },
          { upsert: true, new: true }
        ).lean();
        results.push(doc);
      }
      return NextResponse.json({ updated: results.length, settings: results });
    }
    return NextResponse.json({ error: "Provide { key, value } or { settings: { key: value } }" }, { status: 400 });
  } catch (e) {
    console.error("Admin set settings error:", e);
    return NextResponse.json({ error: "Failed to set settings" }, { status: 500 });
  }
});
