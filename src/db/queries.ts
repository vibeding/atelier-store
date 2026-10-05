import { and, desc, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, stock } from "@/db/schema";

export type Product = {
  slug: string;
  name: string;
  category: string;
  categoryId: number;
  price: number;
  image: string;
  alt: string;
  badge?: string;
  description: string;
  details: string[];
  sizes?: string[];
  stock: number;
};

const columns = {
  slug: products.slug,
  name: products.name,
  category: categories.name,
  categoryId: products.categoryId,
  priceCents: products.priceCents,
  image: products.image,
  alt: products.alt,
  badge: products.badge,
  description: products.description,
  details: products.details,
  sizes: products.sizes,
  // A missing stock row reads as sold out.
  stock: sql<number>`coalesce(${stock.quantity}, 0)`.mapWith(Number),
};

type Row = Omit<Product, "price" | "badge" | "sizes"> & {
  priceCents: number;
  badge: string | null;
  sizes: string[] | null;
};

const toProduct = ({ priceCents, badge, sizes, ...row }: Row): Product => ({
  ...row,
  price: priceCents / 100,
  badge: badge ?? undefined,
  sizes: sizes ?? undefined,
});

const baseQuery = () =>
  db
    .select(columns)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .leftJoin(stock, eq(stock.productId, products.id));

export async function getProducts(): Promise<Product[]> {
  const rows = await baseQuery()
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt), products.id);
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const [row] = await baseQuery()
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1);
  return row && toProduct(row);
}

export async function getRelatedProducts(
  product: Pick<Product, "slug" | "categoryId">,
  limit = 4,
): Promise<Product[]> {
  const rows = await baseQuery()
    .where(and(eq(products.isActive, true), ne(products.slug, product.slug)))
    .orderBy(desc(sql`${products.categoryId} = ${product.categoryId}`), products.id)
    .limit(limit);
  return rows.map(toProduct);
}

export async function getProductSlugs(): Promise<string[]> {
  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.isActive, true));
  return rows.map((r) => r.slug);
}
