import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const metadata = { title: "Admin Girişi" };

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session.id) redirect("/admin");

  return (
    <div className="min-h-[70vh] grid place-items-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-black tracking-tight text-center mb-1">
          Yönetici Girişi
        </h1>
        <p className="text-sm text-ink-500 text-center mb-8">
          Naturel Çiçekçilik admin paneli
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
