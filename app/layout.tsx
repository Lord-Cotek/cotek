// app/layout.tsx
import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import Cosmos from "@/components/Cosmos";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import KeyboardConsole from "@/components/KeyboardConsole";
import RoomTint from "@/components/RoomTint";
import { TEMI } from "@/lib/identities";

const sans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});

const serif = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = process.env.SITE_URL || "https://cotek.me";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${TEMI.fullName} — Cotek`,
    template: `%s · ${TEMI.shortName}`,
  },
  description:
    "Temitayo Ezekiel Olayiwola — Cotek Temi, Temi Cotek, Omogbolahan, Kadiri. Environmentalist, software founder, author, poet, Bible teacher. COTEK means hope.",
  keywords: [
    ...TEMI.names,
    "Cotek",
    "AMRO",
    "Action International Services",
    "Cotek App",
    "RAK Church",
    "Emirates Nature WWF",
    "water treatment UAE",
    "wastewater GCC",
    "Orchids and Tamarind",
    "IISER",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${TEMI.fullName} — Cotek`,
    description:
      "Author. Builder. Steward of water. Bible teacher. COTEK means hope.",
    url: SITE_URL,
    siteName: "cotek.me",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${TEMI.fullName} — Cotek`,
    description:
      "Author. Builder. Steward of water. Bible teacher. COTEK means hope.",
  },
  robots: { index: true, follow: true },
};

function PersonJsonLd() {
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: TEMI.fullName,
    alternateName: TEMI.names,
    jobTitle: "Environment Division Manager",
    worksFor: {
      "@type": "Organization",
      name: "AMRO",
    },
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

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
    >
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Cosmos />
        <RoomTint />
        <div className="shell">
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </div>
        <KeyboardConsole />
        <PersonJsonLd />
      </body>
    </html>
  );
}
