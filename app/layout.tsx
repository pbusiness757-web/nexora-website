import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "../lib/locale-context";
import BackToTop from "../components/ui/BackToTop";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexora.example";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nexora — Crypto-to-Bank Payout Infrastructure",
    template: "%s — Nexora",
  },
  description:
    "Send cryptocurrency and settle payments in local currencies across CIS countries. Corporate payouts, supplier and contractor payments.",
  applicationName: "Nexora",
  keywords: [
    "crypto to bank",
    "crypto payouts",
    "supplier payments",
    "contractor payments",
    "corporate payouts",
    "USDT payout",
    "CIS payments",
    "Nexora",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Nexora — Crypto-to-Bank Payout Infrastructure",
    description:
      "Crypto-to-bank payout infrastructure for businesses and individuals across CIS countries.",
    type: "website",
    siteName: "Nexora",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — Crypto-to-Bank Payout Infrastructure",
    description:
      "Crypto-to-bank payout infrastructure for businesses and individuals across CIS countries.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nexora",
  url: SITE_URL,
  description:
    "Crypto-to-bank payout infrastructure for businesses and individuals across CIS countries.",
  areaServed: ["RU", "KZ", "UZ", "AZ", "KG"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <LocaleProvider>
          {children}
          <BackToTop />
        </LocaleProvider>
      </body>
    </html>
  );
}
