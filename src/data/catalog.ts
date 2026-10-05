// Static storefront content. Products, categories and stock live in the database (src/db).

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=75&w=1600`;

export type Collection = {
  slug: string;
  title: string;
  image: string;
  alt: string;
};

export type StockState = "in-stock" | "low-stock" | "out-of-stock";

export const LOW_STOCK_THRESHOLD = 3;

export const getStockState = (stock: number): StockState =>
  stock <= 0 ? "out-of-stock" : stock <= LOW_STOCK_THRESHOLD ? "low-stock" : "in-stock";

export const heroImage = {
  src: img("1539109136881-3be0616acf4b"),
  alt: "Woman in a pale blue coat and scarf standing in a plaza",
};

export const editorialImage = {
  src: img("1490481651871-ab68de25d43d"),
  alt: "Neutral knitwear and blouses on a rail",
};

export const collections: Collection[] = [
  {
    slug: "outerwear",
    title: "Outerwear",
    image: img("1483985988355-763728e1935b"),
    alt: "Woman in a burgundy coat holding shopping bags",
  },
  {
    slug: "summer-dresses",
    title: "Summer Dresses",
    image: img("1496747611176-843222e1e57c"),
    alt: "Floral wrap dress moving in the breeze by the sea",
  },
  {
    slug: "accessories",
    title: "Accessories",
    image: img("1469334031218-e382a71b716b"),
    alt: "Woman holding round tinted sunglasses",
  },
];

export const navigation = [
  { label: "Women", href: "#" },
  { label: "Men", href: "#" },
  { label: "Bags", href: "#" },
  { label: "Accessories", href: "#" },
  { label: "Gifts", href: "#" },
];

export const services = [
  { title: "Complimentary shipping", body: "On every order over $250." },
  { title: "Easy returns", body: "Thirty days, no questions asked." },
  { title: "Gift wrapping", body: "Presented in our signature box." },
  { title: "Personal advice", body: "Speak with a stylist, daily." },
];

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
