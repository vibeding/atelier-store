import { getStockState, LOW_STOCK_THRESHOLD } from "@/data/catalog";

const copy = {
  "in-stock": { label: "In stock", dot: "bg-ink" },
  "low-stock": { label: "Low stock", dot: "bg-accent" },
  "out-of-stock": { label: "Out of stock", dot: "bg-ink-subtle" },
} as const;

export function StockStatus({ stock }: { stock: number }) {
  const state = getStockState(stock);
  const { label, dot } = copy[state];

  return (
    <p className="flex items-center gap-2 text-sm" role="status">
      <span aria-hidden className={`size-2 rounded-pill ${dot}`} />
      <span className={state === "out-of-stock" ? "text-ink-muted" : undefined}>
        {label}
      </span>
      {state === "low-stock" && stock <= LOW_STOCK_THRESHOLD && (
        <span className="text-ink-muted">· only {stock} left</span>
      )}
    </p>
  );
}
