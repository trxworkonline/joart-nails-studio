import type { Metadata } from "next";
import { Playfair_Display, Pinyon_Script, Poppins } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "JoArt Nails Studio",
  description: "Manicura, pedicura y nail art en Ñuñoa, Santiago. Reserva por WhatsApp.",
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JoArt Nails Studio",
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
        {children}
      </body>
    </html>
  );
}
