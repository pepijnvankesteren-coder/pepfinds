# PepFinds

A premium product discovery platform for Chinese marketplaces — search products
from **Weidian**, **Taobao**, and **1688** in one elegant, Apple-inspired interface.

> **MVP foundation.** This build focuses on clean architecture, premium design,
> and a scalable codebase. All product data is mocked — no real APIs are wired
> in yet.

## Tech stack

- **Next.js 15** (App Router, Server Components)
- **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first `@theme` config)
- **Framer Motion** (scroll reveals, parallax, micro-interactions)
- **shadcn/ui** conventions (`cn`, `cva`, Radix `Slot` for the Button)
- **lucide-react** icons

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
```

## Project structure

```
src/
├─ app/
│  ├─ layout.tsx           # Root layout: metadata/SEO, Navbar, Footer
│  ├─ page.tsx             # Landing page (Hero → Features → Showcase → Marketplaces)
│  ├─ globals.css          # Tailwind v4 theme + design tokens
│  ├─ not-found.tsx        # 404
│  ├─ robots.ts            # robots.txt
│  ├─ sitemap.ts           # sitemap.xml
│  └─ search/page.tsx      # /search — mock results + empty state
├─ components/
│  ├─ layout/              # Navbar, Footer
│  ├─ home/                # Hero, Features, ProductShowcase, MarketplacesSection
│  ├─ product/             # ProductCard, ProductGrid
│  ├─ marketplace/         # MarketplaceCard, MarketplaceBadge
│  └─ ui/                  # Button, Container, SearchBar, Reveal
└─ lib/
   ├─ types.ts             # Domain types (Product, Marketplace, SearchResponse)
   ├─ marketplaces.ts      # Source-of-truth marketplace registry
   ├─ mock-data.ts         # Mock catalog + searchProducts() (async, API-shaped)
   ├─ site.ts              # Site metadata + nav config
   └─ utils.ts             # cn(), formatPrice()
```

## Design system

A restrained black / white / light-gray palette defined as design tokens in
[`globals.css`](src/app/globals.css) and exposed through Tailwind utilities
(`bg-ink`, `text-muted`, `border-line`, `rounded-3xl`, `shadow-soft`/`shadow-float`).
Typography targets the SF Pro family with a system-font fallback stack.

## Built for scale

The architecture leaves clear seams for future features without building them yet:

- **`searchProducts()`** is already async and returns an API-shaped
  `SearchResponse`, so swapping mock data for a real backend touches one function.
- **`lib/types.ts`** carries reserved fields (`category`, `rating`, `soldCount`)
  for ranking, filtering, and analytics.
- **`marketplaces.ts`** is a single registry — adding a marketplace updates
  badges, cards, and links everywhere at once.
- Component layering (`ui` → `domain` → `home`) keeps future pages composable.

Planned next: reverse image search, AI product matching, agent integrations,
user accounts, favorites, affiliate tracking, and price comparisons.
