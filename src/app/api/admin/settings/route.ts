import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await req.json().catch(() => null)) as Record<string, string> | null;
  if (!body) return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });

  for (const [key, value] of Object.entries(body)) {
    await prisma.setting.upsert({
      where: { settingKey: key },
      create: { settingKey: key, settingValue: value },
      update: { settingValue: value },
    });
  }
  return NextResponse.json({ ok: true });
}
