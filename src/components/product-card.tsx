import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/data/catalog";
import type { Product } from "@/db/queries";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  return (
    <Link href={`/products/${product.slug}`} className="product-card bg-canvas">
      <div className="media-frame">
        <Image
          src={product.image}
          alt={product.alt}
          fill
          priority={priority}
          sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 33vw, 50vw"
        />
        {product.stock <= 0 ? (
          <span className="absolute left-3 top-3 bg-canvas px-2 py-1 text-micro uppercase tracking-caps text-ink-muted">
            Sold out
          </span>
        ) : product.badge && (
          <span className="absolute left-3 top-3 bg-canvas px-2 py-1 text-micro uppercase tracking-caps">
            {product.badge}
          </span>
        )}
      </div>
      <div className="product-card__meta">
        <p className="text-eyebrow text-ink-muted">{product.category}</p>
        <h3 className="text-sm">{product.name}</h3>
        <p className="product-card__price">{formatPrice(product.price)}</p>
      </div>
    </Link>
  );
}
