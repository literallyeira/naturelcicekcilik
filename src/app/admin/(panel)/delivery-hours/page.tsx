import { prisma } from "@/lib/db";
import { DeliveryHourManager } from "./DeliveryHourManager";

export const dynamic = "force-dynamic";

export default async function DeliveryHoursPage() {
  const hours = await prisma.deliveryHour.findMany({ orderBy: { id: "asc" } });
  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Teslimat Saatleri</h1>
        <p className="text-ink-500 text-sm">
          Müşteriye gösterilen saat slotları
        </p>
      </header>
      <DeliveryHourManager
        initial={hours.map((h) => ({
          id: h.id,
          timeSlot: h.timeSlot,
          isActive: h.isActive,
        }))}
      />
    </div>
  );
}
