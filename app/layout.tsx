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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexoraexample.pro";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Nexora — Выплаты USDT → RUB/KZT/UZS | Крипто-платежи СНГ",
    template: "%s — Nexora",
  },
  description:
    "Выплаты поставщикам и подрядчикам криптовалютой. USDT → рубли, тенге, сум, манат. Корпоративные B2B-расчёты по странам СНГ за 15 минут. AML/KYB комплаенс.",
  applicationName: "Nexora",
  keywords: [
    "крипто выплаты поставщикам",
    "выплаты подрядчикам криптовалюта",
    "вывод usdt на банковский счет россия",
    "usdt to rub b2b",
    "crypto to bank CIS",
    "крипто платежи казахстан тенге",
    "USDT выплата рубли",
    "crypto payout russia",
    "b2b crypto payments CIS",
    "Nexora",
  ],
  alternates: {
    canonical: SITE_URL,
    languages: {
      ru: `${SITE_URL}/`,
      en: `${SITE_URL}/`,
      kk: `${SITE_URL}/`,
      uz: `${SITE_URL}/`,
      az: `${SITE_URL}/`,
      ky: `${SITE_URL}/`,
      "x-default": `${SITE_URL}/`,
    },
  },
  openGraph: {
    title: "Nexora — Выплаты USDT → RUB/KZT/UZS | Крипто-платежи СНГ",
    description:
      "Выплаты поставщикам и подрядчикам криптовалютой. USDT → рубли, тенге, сум. Корпоративные B2B-расчёты по СНГ за 15 минут.",
    type: "website",
    siteName: "Nexora",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Nexora — Crypto-to-Bank Payout Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nexora — Выплаты USDT → RUB/KZT/UZS | Крипто-платежи СНГ",
    description:
      "Выплаты поставщикам и подрядчикам криптовалютой. USDT → рубли, тенге, сум. B2B-расчёты по СНГ за 15 минут.",
    images: [`${SITE_URL}/og-image.png`],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nexora",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.ico`,
  description:
    "Крипто-в-банк платформа для выплат поставщикам, подрядчикам и корпоративных B2B-расчётов по странам СНГ.",
  areaServed: ["RU", "KZ", "UZ", "AZ", "KG"],
  sameAs: ["https://t.me/nexoranotify_bot"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "support@nexoraexample.pro",
    url: "https://t.me/nexoranotify_bot",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
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
