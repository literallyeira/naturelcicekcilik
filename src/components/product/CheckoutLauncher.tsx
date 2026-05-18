"use client";

import { useState } from "react";
import { CheckoutDialog } from "./CheckoutDialog";

type Props = {
  product: {
    id: number;
    name: string;
    price: string;
    image: string | null;
  };
  deliveryHours: { id: number; timeSlot: string }[];
};

export function CheckoutLauncher({ product, deliveryHours }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="mt-8 w-full h-14 rounded-full bg-brand-500 text-white font-semibold uppercase tracking-wider hover:bg-brand-600 transition-colors"
      >
        Sipariş Ver
      </button>
      {open ? (
        <CheckoutDialog
          product={product}
          deliveryHours={deliveryHours}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
