import type { Metadata } from "next";
import { Playfair_Display, Pinyon_Script, Poppins } from "next/font/google";
import "./globals.css";
import LenisProvider from "./components/LenisProvider";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pinyon",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-poppins",
  display: "swap",
});

const SITE_URL = "https://joart-web.vercel.app";
const SITE_TITLE = "JoArt Nails Studio";
const SITE_DESCRIPTION = "Manicura, pedicura y nail art en Ñuñoa, Santiago. Reserva por WhatsApp.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JoArt Nails Studio",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  priceRange: "$6.990 - $27.990",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Ñuñoa",
    addressRegion: "Santiago",
    addressCountry: "CL",
  },
  telephone: "+56988210335",
  sameAs: ["https://instagram.com/joart.cl"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${playfairDisplay.variable} ${pinyonScript.variable} ${poppins.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
