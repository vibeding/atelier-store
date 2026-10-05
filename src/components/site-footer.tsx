import Link from "next/link";

const columns = [
  { title: "Client services", links: ["Contact us", "Shipping", "Returns", "Care guide"] },
  { title: "The house", links: ["Our story", "Craftsmanship", "Sustainability", "Careers"] },
  { title: "Stores", links: ["Find a boutique", "Book an appointment", "Gift cards"] },
];

export function SiteFooter() {
  return (
    <footer className="rule mt-auto bg-canvas">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-serif text-2xl uppercase tracking-caps-wide">Atelier</p>
          <p className="mt-4 max-w-xs text-sm text-ink-muted">
            Considered wardrobes, made to be worn for years.
          </p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-eyebrow">{col.title}</h2>
            <ul className="mt-4 space-y-3">
              {col.links.map((label) => (
                <li key={label}>
                  <Link href="#" className="text-sm text-ink-muted hover:text-ink">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="rule">
        <p className="container-page py-6 text-micro uppercase tracking-caps text-ink-muted">
          © {new Date().getFullYear()} Atelier. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
