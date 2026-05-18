"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

type Cat = { id: number; name: string; slug: string };

export function CategoryDrawer({
  categories,
  children,
}: {
  categories: Cat[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{children}</span>
      {open ? (
        <div
          className="fixed inset-0 z-50 bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className={cn(
              "absolute top-0 left-0 h-full w-80 max-w-[90vw] bg-white shadow-xl",
              "flex flex-col",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-ink-100">
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Kategoriler
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Kapat"
                className="size-8 grid place-items-center hover:bg-ink-100 rounded-full"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto py-2">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/kategori/${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center px-5 py-3 text-sm hover:bg-cream-50 transition-colors border-b border-ink-100/60"
                >
                  {c.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
