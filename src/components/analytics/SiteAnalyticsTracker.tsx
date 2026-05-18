"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const VISITOR_KEY = "naturel_visitor_id";

function createVisitorId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function getVisitorId() {
  try {
    const existing = localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;

    const nextId = createVisitorId();
    localStorage.setItem(VISITOR_KEY, nextId);
    return nextId;
  } catch {
    return createVisitorId();
  }
}

export function SiteAnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        path: pathname,
        visitorId: getVisitorId(),
      }),
      keepalive: true,
    }).catch(() => {
      // Analytics should never interrupt the storefront.
    });
  }, [pathname]);

  return null;
}
