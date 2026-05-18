import { prisma } from "@/lib/db";
import { SettingsForm } from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany();
  const map = Object.fromEntries(
    settings.map((s) => [s.settingKey, s.settingValue ?? ""]),
  );
  return (
    <div className="space-y-6 max-w-xl">
      <header>
        <h1 className="text-2xl font-black text-ink-900">Ayarlar</h1>
        <p className="text-ink-500 text-sm">Mağaza yapılandırması</p>
      </header>
      <SettingsForm
        kdvIncluded={map["kdv_dahil"] === "1"}
        activeTheme={map["active_theme"] ?? "default"}
      />
    </div>
  );
}
