import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, verifyAdmin } from "@/lib/auth";

const schema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz veri" }, { status: 400 });
  }
  const admin = await verifyAdmin(parsed.data.username, parsed.data.password);
  if (!admin) {
    return NextResponse.json(
      { error: "Kullanıcı adı veya şifre hatalı" },
      { status: 401 },
    );
  }
  const session = await getSession();
  session.id = admin.id;
  session.username = admin.username;
  session.name = admin.name;
  session.isSuperadmin = admin.isSuperadmin;
  await session.save();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
