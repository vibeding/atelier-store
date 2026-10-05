// Idempotent seed: `npm run db:seed`. Upserts by slug / product_id, safe to re-run.
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=1600`;

const categorySeed = [
  { slug: "handbags", name: "Handbags" },
  { slug: "knitwear", name: "Knitwear" },
  { slug: "outerwear", name: "Outerwear" },
  { slug: "essentials", name: "Essentials" },
  { slug: "trousers", name: "Trousers" },
  { slug: "loungewear", name: "Loungewear" },
  { slug: "dresses", name: "Dresses" },
];

const productSeed = [
  {
    slug: "structured-teal-handbag",
    name: "Structured Top-Handle Bag",
    category: "handbags",
    price: 1450,
    image: img("1594223274512-ad4803739b7c"),
    alt: "Teal leather top-handle bag with gold clasp",
    badge: "New",
    description: "A structured top-handle bag in grained teal leather, finished with a gold-tone push-lock. Room for the daily essentials, with an adjustable strap for hands-free wear.",
    details: ["Grained calf leather", "Gold-tone hardware", "Interior zip pocket", "Dimensions: 26 × 20 × 10 cm"],
    stock: 2,
  },
  {
    slug: "fringe-knit-poncho",
    name: "Fringed Open-Knit Poncho",
    category: "knitwear",
    price: 620,
    image: img("1434389677669-e08b4cac3105"),
    alt: "Cream open-knit poncho on a wooden hanger",
    description: "An airy open-knit poncho with hand-finished fringe. Layer it over a slip dress or a simple tee for easy movement.",
    details: ["100% organic cotton", "Relaxed, one-size fit", "Hand wash cold"],
    sizes: ["One size"],
    stock: 12,
  },
  {
    slug: "satin-bomber-jacket",
    name: "Satin Bomber Jacket",
    category: "outerwear",
    price: 890,
    image: img("1591047139829-d91aecb6caea"),
    alt: "Copper-toned bomber jacket on a hanger",
    badge: "New",
    description: "A lightweight bomber in a soft copper satin finish, with ribbed trims and a clean zip front.",
    details: ["Recycled polyester shell", "Ribbed collar, cuffs and hem", "Two side pockets, one sleeve pocket"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 0,
  },
  {
    slug: "washed-cotton-tee",
    name: "Washed Cotton Tee",
    category: "essentials",
    price: 190,
    image: img("1523381210434-271e8be1f52b"),
    alt: "Sage green cotton tees on wooden hangers",
    description: "A heavyweight tee, garment-washed for a soft hand and a lived-in drape in a muted sage.",
    details: ["100% combed cotton", "Garment washed", "Regular fit"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 40,
  },
  {
    slug: "striped-wide-leg-trousers",
    name: "Striped Wide-Leg Trousers",
    category: "trousers",
    price: 540,
    image: img("1509631179647-0177331693ae"),
    alt: "Model in black and white striped wide-leg trousers",
    description: "High-waisted trousers cut wide through the leg in a graphic black and white stripe.",
    details: ["Viscose-blend crepe", "Concealed zip and hook closure", "Full length"],
    sizes: ["XS", "S", "M", "L"],
    stock: 7,
  },
  {
    slug: "sunshine-lounge-set",
    name: "Cropped Hoodie and Jogger Set",
    category: "loungewear",
    price: 460,
    image: img("1515886657613-9f3515b0c78f"),
    alt: "Model in a yellow cropped hoodie and joggers",
    description: "A cropped hoodie and matching joggers in brushed fleece, made for easy weekends.",
    details: ["Brushed organic cotton fleece", "Drawstring hood and waist", "Sold as a set"],
    sizes: ["XS", "S", "M", "L"],
    stock: 3,
  },
  {
    slug: "burgundy-zip-coat",
    name: "Burgundy Zip Coat",
    category: "outerwear",
    price: 1980,
    image: img("1483985988355-763728e1935b"),
    alt: "Burgundy zip coat worn with a rose turtleneck",
    description: "A sharply cut coat in deep burgundy wool, with a stand collar and a clean zip closure.",
    details: ["Wool-blend twill", "Satin-lined body", "Dry clean only"],
    sizes: ["XS", "S", "M", "L"],
    stock: 5,
  },
  {
    slug: "floral-wrap-dress",
    name: "Floral Wrap Dress",
    category: "dresses",
    price: 780,
    image: img("1496747611176-843222e1e57c"),
    alt: "Cream floral wrap dress",
    badge: "Bestseller",
    description: "A fluid wrap dress in a painterly rose print, with a tie waist and a soft, floating hem.",
    details: ["Lightweight viscose", "Tie waist, wrap front", "Midi length"],
    sizes: ["XS", "S", "M", "L"],
    stock: 18,
  },
];

async function main() {
  // Imported after dotenv so src/db/index.ts sees DATABASE_URL.
  const { db, client } = await import("@/db");
  const { categories, products, stock } = await import("@/db/schema");
  const { sql } = await import("drizzle-orm");

  await db
    .insert(categories)
    .values(categorySeed)
    .onConflictDoUpdate({
      target: categories.slug,
      set: { name: sql`excluded.name` },
    });

  const categoryRows = await db.select().from(categories);
  const categoryId = new Map(categoryRows.map((c) => [c.slug, c.id]));

  for (const { category, price, stock: quantity, ...p } of productSeed) {
    const values = {
      ...p,
      badge: "badge" in p ? p.badge : null,
      sizes: "sizes" in p ? p.sizes : null,
      categoryId: categoryId.get(category)!,
      priceCents: price * 100,
    };
    const [row] = await db
      .insert(products)
      .values(values)
      .onConflictDoUpdate({ target: products.slug, set: values })
      .returning({ id: products.id });

    await db
      .insert(stock)
      .values({ productId: row.id, quantity })
      .onConflictDoUpdate({ target: stock.productId, set: { quantity } });
  }

  const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(products);
  console.log(`Seeded ${categorySeed.length} categories, ${count} products.`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
