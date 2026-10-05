"use client";

import Link from "next/link";
import { useState } from "react";
import { navigation } from "@/data/catalog";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="bg-ink text-canvas">
        <p className="container-page py-2 text-center text-micro uppercase tracking-caps">
          Complimentary shipping on orders over $250
        </p>
      </div>

      <header className="site-header">
        <div className="container-page grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <nav aria-label="Primary" className="flex items-center">
            <button
              type="button"
              className="text-nav lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Close" : "Menu"}
            </button>
            <ul className="hidden items-center gap-8 lg:flex">
              {navigation.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="link-nav">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Link
            href="/"
            className="font-serif text-2xl uppercase tracking-caps-wide sm:text-3xl"
            aria-label="Atelier, home"
          >
            Atelier
          </Link>

          <div className="flex items-center justify-end gap-5">
            <Link href="#" className="link-nav hidden sm:inline">
              Search
            </Link>
            <Link href="#" className="link-nav hidden sm:inline">
              Account
            </Link>
            <Link href="#" className="link-nav" aria-label="Shopping bag, 0 items">
              Bag (0)
            </Link>
          </div>
        </div>

        <div
          id="mobile-menu"
          hidden={!open}
          className="absolute inset-x-0 top-full border-b border-line bg-canvas lg:hidden"
        >
          <ul className="container-page flex flex-col py-2">
            {[...navigation, { label: "Search", href: "#" }, { label: "Account", href: "#" }].map(
              (item) => (
                <li key={item.label} className="rule-b last:border-b-0">
                  <Link
                    href={item.href}
                    className="text-nav block py-4"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </header>
    </>
  );
}
