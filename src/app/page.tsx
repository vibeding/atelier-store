import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { collections, editorialImage, heroImage, services } from "@/data/catalog";
import { getProducts } from "@/db/queries";

// Stock is read from the database; refresh the prerendered page every minute.
export const revalidate = 60;

export default async function Home() {
  const products = await getProducts();

  return (
    <>
        {/* Hero: full-bleed editorial image, copy anchored bottom-left */}
        <section className="relative isolate flex min-h-[min(78svh,40rem)] items-end overflow-hidden bg-surface-strong text-canvas lg:min-h-[min(calc(100svh-6rem),52rem)]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover object-[50%_20%]"
          />
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-black/60 via-black/10 to-transparent"
          />
          <div className="container-page pb-10 sm:pb-16">
            <p className="text-eyebrow">Autumn / Winter</p>
            <h1 className="text-hero mt-4 max-w-3xl">The Quiet Luxury Edit</h1>
            <p className="mt-5 max-w-md text-base">
              Soft tailoring, rich texture and a palette made for the cold months.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#" className="btn btn-light">
                Shop the edit
              </Link>
              <Link href="#" className="btn btn-light">
                Discover outerwear
              </Link>
            </div>
          </div>
        </section>

        {/* Featured collections */}
        <section className="section" aria-labelledby="collections-title">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-eyebrow text-ink-muted">Featured collections</p>
                <h2 id="collections-title" className="text-display mt-3">
                  Explore the season
                </h2>
              </div>
              <Link href="#" className="link-nav hidden sm:inline">
                View all
              </Link>
            </div>
            <ul className="grid gap-1 sm:grid-cols-3">
              {collections.map((c, i) => (
                <li key={c.slug}>
                  <Link href="#" className="group block">
                    <div className="media-frame aspect-[3/4]">
                      <Image
                        src={c.image}
                        alt={c.alt}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 40rem) 33vw, 100vw"
                        className="transition-transform duration-700 group-hover:scale-[1.03]"
                      />
                    </div>
                    <h3 className="text-nav py-4 underline decoration-transparent decoration-1 underline-offset-[0.5em] transition-[text-decoration-color] group-hover:decoration-current">
                      {c.title}
                    </h3>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Featured products */}
        <section className="pb-[var(--spacing-section)]" aria-labelledby="products-title">
          <div className="container-page">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-eyebrow text-ink-muted">New arrivals</p>
                <h2 id="products-title" className="text-display mt-3">
                  Pieces to live in
                </h2>
              </div>
              <Link href="#" className="link-nav">
                Shop all
              </Link>
            </div>
            <div className="product-grid">
              {products.map((p, i) => (
                <ProductCard key={p.slug} product={p} priority={i < 2} />
              ))}
            </div>
          </div>
        </section>

        {/* Editorial split */}
        <section className="bg-surface" aria-labelledby="editorial-title">
          <div className="mx-auto grid max-w-page lg:grid-cols-2">
            <div className="media-frame aspect-[4/3] lg:aspect-auto lg:min-h-[36rem]">
              <Image
                src={editorialImage.src}
                alt={editorialImage.alt}
                fill
                sizes="(min-width: 64rem) 50vw, 100vw"
              />
            </div>
            <div className="flex flex-col justify-center gap-6 px-[var(--spacing-gutter)] py-14 lg:px-20">
              <p className="text-eyebrow text-ink-muted">The wardrobe</p>
              <h2 id="editorial-title" className="text-display">
                Built from the basics up
              </h2>
              <p className="max-w-md text-base text-ink-muted">
                Natural fibres, honest cuts and neutral tones that layer together.
                Start with the essentials and build a wardrobe that lasts.
              </p>
              <div>
                <Link href="#" className="btn btn-primary">
                  Explore essentials
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Client services */}
        <section aria-label="Client services">
          <ul className="container-page grid sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li
                key={s.title}
                className="rule-b border-line py-8 sm:px-6 sm:first:pl-0 lg:border-b-0 lg:border-l lg:first:border-l-0"
              >
                <h3 className="text-eyebrow">{s.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{s.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Newsletter */}
        <section className="rule section" aria-labelledby="newsletter-title">
          <div className="container-narrow text-center">
            <h2 id="newsletter-title" className="text-display-sm-style">
              Letters from Atelier
            </h2>
            <p className="mt-3 text-sm text-ink-muted">
              New collections and private events, delivered occasionally.
            </p>
            <form className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end">
              <label className="flex-1 text-left">
                <span className="sr-only">Email address</span>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Email address"
                  className="field"
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </section>
    </>
  );
}
