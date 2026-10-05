import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { PurchasePanel } from "@/components/purchase-panel";
import { StockStatus } from "@/components/stock-status";
import { formatPrice } from "@/data/catalog";
import { getProductBySlug, getProductSlugs, getRelatedProducts } from "@/db/queries";

// Stock is read from the database; refresh the prerendered page every minute.
export const revalidate = 60;

export async function generateStaticParams() {
  return (await getProductSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/products/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} | Atelier`,
    description: product.description,
  };
}

export default async function ProductPage(props: PageProps<"/products/[slug]">) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product, 4);

  return (
    <>
      <nav aria-label="Breadcrumb" className="container-page py-4">
        <ol className="flex flex-wrap items-center gap-2 text-micro uppercase tracking-caps text-ink-muted">
          <li>
            <Link href="/" className="hover:text-ink">
              Home
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="#" className="hover:text-ink">
              {product.category}
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li aria-current="page" className="text-ink">
            {product.name}
          </li>
        </ol>
      </nav>

      <section className="container-page grid gap-8 pb-[var(--spacing-section)] lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-16">
        {/* Imagery: stacked large frames, one full view and one detail crop */}
        <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <div className="media-frame aspect-[4/5] sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <Image
              src={product.image}
              alt={product.alt}
              fill
              priority
              sizes="(min-width: 64rem) 55vw, 100vw"
            />
          </div>
          <div className="media-frame aspect-[4/5]">
            <Image
              src={product.image}
              alt={`${product.name}, detail`}
              fill
              sizes="(min-width: 80rem) 27vw, (min-width: 40rem) 50vw, 100vw"
              className="origin-[30%_25%] scale-[1.9]"
            />
          </div>
          <div className="media-frame aspect-[4/5]">
            <Image
              src={product.image}
              alt={`${product.name}, close view`}
              fill
              sizes="(min-width: 80rem) 27vw, (min-width: 40rem) 50vw, 100vw"
              className="origin-[75%_80%] scale-[1.9]"
            />
          </div>
        </div>

        {/* Information: sticky on desktop */}
        <div className="lg:sticky lg:top-[calc(var(--spacing-header)+1.5rem)] lg:self-start">
          <p className="text-eyebrow text-ink-muted">{product.category}</p>
          <h1 className="text-display mt-3">{product.name}</h1>
          <p className="mt-4 text-lg">{formatPrice(product.price)}</p>
          <div className="mt-4">
            <StockStatus stock={product.stock} />
          </div>

          <p className="mt-8 text-base text-ink-muted">{product.description}</p>

          <div className="mt-8">
            <PurchasePanel sizes={product.sizes} stock={product.stock} />
          </div>

          <div className="rule mt-10">
            <details className="rule-b group py-4" open>
              <summary className="text-eyebrow flex list-none items-center justify-between">
                Details
                <span aria-hidden className="group-open:hidden">+</span>
                <span aria-hidden className="hidden group-open:inline">−</span>
              </summary>
              <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-ink-muted">
                {product.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </details>
            <details className="rule-b group py-4">
              <summary className="text-eyebrow flex list-none items-center justify-between">
                Shipping and returns
                <span aria-hidden className="group-open:hidden">+</span>
                <span aria-hidden className="hidden group-open:inline">−</span>
              </summary>
              <p className="mt-4 text-sm text-ink-muted">
                Complimentary shipping on orders over $250. Returns accepted
                within thirty days of delivery.
              </p>
            </details>
          </div>
        </div>
      </section>

      <section className="rule section" aria-labelledby="related-title">
        <div className="container-page">
          <h2 id="related-title" className="text-display mb-8">
            You may also like
          </h2>
          <div className="product-grid">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
