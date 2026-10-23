import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Belmont Hotel Abuja — Luxury Hotel & Suites in Wuye, Abuja, Nigeria",
    template: "%s | Belmont Hotel Abuja",
  },
  description:
    "Experience 5-star luxury at Belmont Hotel Abuja, located at Plot 1032 R.I. Uzoma Street, Wuye, Abuja, Nigeria. Book Business Suites, Executive Suites, Deluxe Rooms, Conference Hall, Fine Dining Restaurant, and Catering Services.",
  keywords: [
    "Belmont Hotel Abuja",
    "Belmont Hotel",
    "Hotels in Abuja",
    "Hotels in Wuye Abuja",
    "Luxury Hotel in Abuja Nigeria",
    "Best Hotels in Abuja",
    "Executive Suites Abuja",
    "Business Suite Abuja",
    "Conference Hall in Abuja",
    "Hotel Booking Abuja",
  ],
  authors: [{ name: "Belmont Hotel Abuja" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    siteName: "Belmont Hotel Abuja",
    title: "Belmont Hotel Abuja — Luxury Hotel & Suites in Abuja, Nigeria",
    description:
      "Luxury accommodations in the heart of Abuja. Located at Plot 1032 R.I. Uzoma Street, Wuye, Abuja. Explore our suites, conference hall, fine dining restaurant, and events.",
    images: [
      {
        url: "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784304333/belmont-hotel/kxtucqrtgjcczg16lprb.jpg",
        width: 1200,
        height: 630,
        alt: "Belmont Hotel Abuja",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Belmont Hotel Abuja — Luxury Hotel & Suites in Abuja, Nigeria",
    description:
      "5-star luxury hotel and suites in Wuye, Abuja, Nigeria. Book Executive Suites, Conference Hall, and Fine Dining.",
    images: [
      "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784304333/belmont-hotel/kxtucqrtgjcczg16lprb.jpg",
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const hotelJsonLd = {
  "@context": "https://schema.org",
  "@type": "Hotel",
  name: "Belmont Hotel Abuja",
  description:
    "Luxury 5-star hotel in the heart of Abuja offering Business Suites, Executive Suites, Executive Deluxe, and Deluxe Rooms, alongside a Restaurant, Mini Bar, Conference Hall, and Catering Services.",
  image: [
    "https://res.cloudinary.com/dumtoo8hl/image/upload/v1784304333/belmont-hotel/kxtucqrtgjcczg16lprb.jpg",
    "https://res.cloudinary.com/dumtoo8hl/image/upload/v1785421255/belmont-hotel/tltfaq7ib9wblopbkfpj.jpg",
    "https://res.cloudinary.com/dumtoo8hl/image/upload/v1786054215/belmont-hotel/uwu6nzja7jcmnujnnphx.jpg",
  ],
  telephone: "+234 702 662 2223",
  priceRange: "₦69,875 - ₦107,500",
  currenciesAccepted: "NGN",
  paymentAccepted: "Cash, Credit Card, Bank Transfer",
  starRating: {
    "@type": "Rating",
    ratingValue: "5",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Plot 1032 R.I. Uzoma Street, Wuye",
    addressLocality: "Abuja",
    addressRegion: "FCT",
    postalCode: "900001",
    addressCountry: "NG",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.0579,
    longitude: 7.4451,
  },
  sameAs: [
    "https://www.facebook.com/Belmonthotelabuja",
    "https://www.instagram.com/belmontabuja/",
    "https://x.com/abuja_hotel",
  ],
  amenityFeature: [
    { "@type": "LocationFeatureSpecification", name: "Free Wi-Fi", value: true },
    { "@type": "LocationFeatureSpecification", name: "Restaurant", value: true },
    { "@type": "LocationFeatureSpecification", name: "Mini Bar", value: true },
    { "@type": "LocationFeatureSpecification", name: "Conference Hall", value: true },
    { "@type": "LocationFeatureSpecification", name: "Catering Services", value: true },
    { "@type": "LocationFeatureSpecification", name: "Air Conditioning", value: true },
  ],
  containsPlace: [
    {
      "@type": "HotelRoom",
      name: "Business Suite",
      description: "49m² suite with 1 extra-large double bed, sofa, work desk, and private bath.",
      offers: {
        "@type": "Offer",
        price: "107500",
        priceCurrency: "NGN",
      },
    },
    {
      "@type": "HotelRoom",
      name: "Executive Suite",
      description: "38m² spacious suite with 1 large double bed, bathtub, and flat-screen TV.",
      offers: {
        "@type": "Offer",
        price: "96750",
        priceCurrency: "NGN",
      },
    },
    {
      "@type": "HotelRoom",
      name: "Executive Deluxe",
      description: "34m² double room with 1 large double bed, air conditioning, and private bath.",
      offers: {
        "@type": "Offer",
        price: "80625",
        priceCurrency: "NGN",
      },
    },
    {
      "@type": "HotelRoom",
      name: "Deluxe Room",
      description: "24m² room with double bed, air conditioning, TV, and private bathroom.",
      offers: {
        "@type": "Offer",
        price: "69875",
        priceCurrency: "NGN",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(hotelJsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
