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
        className="mt-8 w-full h-14 rounded-full bg-brand-500 text-white font-semibold uppercase tracking-[0.12em] text-sm hover:bg-brand-600 shadow-soft hover:shadow-lift transition-all"
      >
        Sipariş Ver
      </button>
      {open ? (
        <CheckoutDialog
          item={{
            name: product.name,
            price: product.price,
            image: product.image,
          }}
          endpoint="/api/checkout"
          payload={{ productId: product.id }}
          deliveryHours={deliveryHours}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
