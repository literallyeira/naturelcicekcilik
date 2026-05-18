import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";

const analyticsSchema = z.object({
  path: z.string().min(1).max(500).refine((value) => value.startsWith("/")),
  visitorId: z.string().min(8).max(64).optional(),
});

const BOT_PATTERN =
  /bot|crawler|spider|crawling|preview|facebookexternalhit|whatsapp|telegram|slurp|bingpreview/i;

function normalizeHeader(value: string | null) {
  if (!value) return null;
  return value.slice(0, 500);
}

function productSlugFromPath(path: string) {
  const cleanPath = path.split("?")[0].replace(/\/+$/, "");
  const match = cleanPath.match(/^\/urun\/([^/]+)$/);
  if (!match) return null;

  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export async function POST(req: NextRequest) {
  const userAgent = normalizeHeader(req.headers.get("user-agent"));
  if (userAgent && BOT_PATTERN.test(userAgent)) {
    return new NextResponse(null, { status: 204 });
  }

  const body = await req.json().catch(() => null);
  const parsed = analyticsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Gecersiz veri" }, { status: 400 });
  }

  const { path, visitorId } = parsed.data;
  try {
    const productSlug = productSlugFromPath(path);
    const product = productSlug
      ? await prisma.product.findUnique({
          where: { slug: productSlug },
          select: { id: true },
        })
      : null;

    await prisma.pageView.create({
      data: {
        path,
        visitorId: visitorId ?? null,
        productId: product?.id ?? null,
        referrer: normalizeHeader(req.headers.get("referer")),
        userAgent,
      },
    });
  } catch (error) {
    console.error("Analytics kaydi alinamadi", error);
  }

  return new NextResponse(null, { status: 204 });
}
