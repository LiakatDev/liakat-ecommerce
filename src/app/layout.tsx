import "styles/globals.css"

import { Metadata } from "next"
import localFont from "next/font/local"
import { GoogleTagManager } from "@next/third-parties/google"
const america = localFont({
  src: [
    {
      path: "./fonts/gtamerica/GT-America-Light.otf",
      weight: "300",
      style: "light",
    },
    {
      path: "./fonts/gtamerica/GT-America-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/gtamerica/GT-America-Medium.otf",
      weight: "500",
      style: "medium",
    },
    {
      path: "./fonts/gtamerica/GT-America-Compressed-Medium-Italic.otf",
      weight: "500",
      style: "italic",
    },
  ],
  variable: "--font-america",
})

export const metadata: Metadata = {
  metadataBase: new URL(`https://flatlisteyewear.com`),
  icons: {
    icon: "/favicon.png",
    apple: "/icon-512x512.png",
  },
  title: {
    default: "FLATLIST Eyewear",
    template: "%s | FLATLIST Eyewear",
  },
  description:
    "AT FLATLIST WE BELIEVE THAT EXCEPTIONAL QUALITY IS THE CORNERSTONE OF MEMORABLE EXPERIENCES. DRAWING INSPIRATION FROM BOTH LOCAL AND INTERNATIONAL INFLUENCES, FLATLIST HAS BECOME A GO-TO CHOICE FOR CREATIVES WHO SEEK EYEWEAR AS UNIQUE AS THEIR VISION.",
  openGraph: {
    title: "FLATLIST Eyewear",
    description:
      "AT FLATLIST WE BELIEVE THAT EXCEPTIONAL QUALITY IS THE CORNERSTONE OF MEMORABLE EXPERIENCES. DRAWING INSPIRATION FROM BOTH LOCAL AND INTERNATIONAL INFLUENCES, FLATLIST HAS BECOME A GO-TO CHOICE FOR CREATIVES WHO SEEK EYEWEAR AS UNIQUE AS THEIR VISION.",
    type: "website",
    siteName: "FLATLIST",
    url: "https://flatlisteyewear.com",
    images: [
      {
        url: "https://flatlisteyewear.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "FLATLIST Eyewear",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FLATLIST Eyewear",
    description:
      "AT FLATLIST WE BELIEVE THAT EXCEPTIONAL QUALITY IS THE CORNERSTONE OF MEMORABLE EXPERIENCES. DRAWING INSPIRATION FROM BOTH LOCAL AND INTERNATIONAL INFLUENCES, FLATLIST HAS BECOME A GO-TO CHOICE FOR CREATIVES WHO SEEK EYEWEAR AS UNIQUE AS THEIR VISION.",
    images: ["https://flatlisteyewear.com/twitter-card.png"],
  },
  authors: [{ name: "FLATLIST Eyewear", url: "https://flatlisteyewear.com" }],
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "Organization",
    name: "FLATLIST Eyewear",
    legalName: "Flatlist Eyewear ApS",
    url: "https://flatlisteyewear.com",
    sameAs: ["https://www.instagram.com/flatlisteyewear"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "København K",
      addressCountry: "DK",
      postalCode: "1114",
      streetAddress: "Kronprinsensgade 6B",
    },
  }

  return (
    <html lang="en" data-mode="light" className={`${america.variable}`}>
      <body>
        <GoogleTagManager gtmId="GTM-5CFCSFQ6" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <main>{props.children}</main>
      </body>
    </html>
  )
}
