"use client";

import { useState } from "react";
import { getStockState } from "@/data/catalog";

export function PurchasePanel({
  sizes,
  stock,
}: {
  sizes?: string[];
  stock: number;
}) {
  const soldOut = getStockState(stock) === "out-of-stock";
  const [size, setSize] = useState<string | null>(
    sizes?.length === 1 ? sizes[0] : null,
  );
  const needsSize = !!sizes?.length && !size;

  return (
    <div className="space-y-6">
      {sizes && (
        <fieldset disabled={soldOut} className="space-y-3">
          <legend className="text-eyebrow mb-3">
            Size{size ? <span className="text-ink-muted"> · {size}</span> : null}
          </legend>
          <div className="flex flex-wrap gap-2">
            {sizes.map((s) => (
              <label key={s} className="relative">
                <input
                  type="radio"
                  name="size"
                  value={s}
                  checked={size === s}
                  onChange={() => setSize(s)}
                  className="peer sr-only"
                />
                <span className="box flex min-h-11 min-w-14 cursor-pointer items-center justify-center px-4 text-xs uppercase tracking-caps transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-40">
                  {s}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="space-y-3">
        <button
          type="button"
          className="btn btn-primary btn-block"
          disabled={soldOut || needsSize}
        >
          {soldOut ? "Sold out" : needsSize ? "Select a size" : "Add to bag"}
        </button>
        <button type="button" className="btn btn-block" disabled={soldOut}>
          Add to wishlist
        </button>
      </div>
    </div>
  );
}
