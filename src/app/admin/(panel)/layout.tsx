import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tags,
  Clock,
  Settings,
  Flower2,
  LogOut,
} from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Yönetim Paneli" };

const NAV = [
  { href: "/admin", label: "Genel Bakış", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Siparişler", icon: ShoppingBag },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/categories", label: "Kategoriler", icon: Tags },
  { href: "/admin/bouquet-prices", label: "Buket Fiyatları", icon: Flower2 },
  { href: "/admin/delivery-hours", label: "Teslimat Saatleri", icon: Clock },
  { href: "/admin/settings", label: "Ayarlar", icon: Settings },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Allow /admin/login to render outside this layout's guard
  // (Next.js routes login under the same /admin segment, so check manually.)
  const session = await requireAdmin();

  // If session missing, let the login page handle it; otherwise redirect.
  // We can't easily detect current path here, so just bail to login for any
  // /admin/* page when not authed. /admin/login itself has its own check.
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-cream-50 flex">
      <aside className="w-64 shrink-0 bg-white border-r border-ink-100 flex flex-col">
        <div className="p-5 border-b border-ink-100">
          <p className="font-black text-ink-900 text-lg">Naturel</p>
          <p className="text-xs text-ink-500">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-700 hover:bg-cream-50 hover:text-ink-900 transition-colors"
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-ink-100">
          <p className="text-xs text-ink-500 px-3 mb-1">
            {session.name ?? session.username}
          </p>
          <form action="/api/admin/logout" method="post">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="size-4" />
              Çıkış Yap
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-x-hidden">
        <div className="p-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
