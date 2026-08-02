import type { Metadata, Viewport } from "next";
import "./globals.css";

import Field from "@/components/field/Field";
import Masthead from "@/components/Masthead";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { TEMI } from "@/lib/identities";
import { STATIONS } from "@/lib/cathedral";

const SITE_URL = process.env.SITE_URL || "https://cotek.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${TEMI.fullName} — Cotek`,
    template: `%s · ${TEMI.shortName}`,
  },
  description:
    "Temitayo Ezekiel Olayiwola — Cotek Temi, Temi Cotek, Omogbolahan, Kadiri. Environmentalist, software founder, author, poet, Bible teacher. COTEK means hope.",
  // Every form of the name, because the entire purpose of this site is that
  // someone searching any one of them arrives at the same person.
  keywords: [
    ...TEMI.names,
    "Cotek",
    "AMRO",
    "Action International Services",
    "Cotek App FZ-LLC",
    "RAK Church",
    "Emirates Nature WWF",
    "water treatment UAE",
    "wastewater GCC",
    "Orchids and Tamarind",
    "Infinity Wall",
    "The Cerulean Monster",
    "IISER",
  ],
  authors: [{ name: TEMI.fullName, url: SITE_URL }],
  creator: TEMI.fullName,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${TEMI.fullName} — Cotek`,
    description: "Author. Builder. Steward of water. Bible teacher. COTEK means hope.",
    url: SITE_URL,
    siteName: "cotek.me",
    locale: "en_AE",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TEMI.fullName} — Cotek`,
    description: "Author. Builder. Steward of water. Bible teacher. COTEK means hope.",
  },
  robots: { index: true, follow: true, "max-image-preview": "large" },
};

export const viewport: Viewport = {
  themeColor: "#08090b",
  colorScheme: "dark",
};

function PersonJsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: TEMI.fullName,
    alternateName: TEMI.names,
    jobTitle: "Environment Division Manager",
    worksFor: { "@type": "Organization", name: "AMRO" },
    affiliation: [
      ...TEMI.memberships.map((m) => ({
        "@type": "Organization",
        name: m.name,
        url: m.url,
      })),
      ...TEMI.affiliations.map((a) => ({
        "@type": "Organization",
        name: a.name,
        ...("url" in a ? { url: a.url } : {}),
      })),
      {
        "@type": "Organization",
        name: "Cotek App FZ-LLC",
        location: "RAKEZ, Ras Al Khaimah, UAE",
      },
    ],
    sameAs: Object.values(TEMI.handles),
    url: SITE_URL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ras Al Khaimah",
      addressCountry: "AE",
    },
    knowsAbout: [
      "water treatment",
      "wastewater treatment",
      "environmental stewardship",
      "marine conservation",
      "accountability software",
      "biblical theology",
      "photography",
      "poetry",
    ],
    description:
      "Environmentalist, software founder, author, poet, Bible teacher, certified diver. Operates across the UAE and the GCC.",
  };

  /* The site's own structure, so a search engine can offer the rooms as
     sitelinks rather than guessing at them from the navigation. */
  const site = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "cotek.me",
    url: SITE_URL,
    author: { "@type": "Person", name: TEMI.fullName },
    hasPart: STATIONS.map((s) => ({
      "@type": "WebPage",
      name: `${s.title} — ${s.room}`,
      url: new URL(s.href, SITE_URL).href,
      description: s.deck,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(site) }}
      />
    </>
  );
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Only the latin subsets of the two faces that render above the fold.
            The ext and vietnamese blocks carry a unicode-range and are fetched
            only by a page that actually contains those glyphs. */}
        <link
          rel="preload"
          href="/fonts/inter-tight-var-normal-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/instrument-serif-400-normal-latin.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </head>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        <Field />
        <Masthead />

        <main id="main">{children}</main>

        <Footer />
        <Reveal />
        <PersonJsonLd />
      </body>
    </html>
  );
}
