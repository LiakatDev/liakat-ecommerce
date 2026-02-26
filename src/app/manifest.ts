import { MetadataRoute } from "next"

const manifest: MetadataRoute.Manifest = {
  name: "FLATLIST EYEWEAR",
  short_name: "FLATLIST",
  description:
    "AT FLATLIST WE BELIEVE THAT EXCEPTIONAL QUALITY IS THE CORNERSTONE OF MEMORABLE EXPERIENCES. DRAWING INSPIRATION FROM BOTH LOCAL AND INTERNATIONAL INFLUENCES, FLATLIST HAS BECOME A GO-TO CHOICE FOR CREATIVES WHO SEEK EYEWEAR AS UNIQUE AS THEIR VISION.",
  start_url: "/",
  display: "standalone",
  background_color: "#fff",
  theme_color: "#000",
  lang: "en-US",
  icons: [
    {
      src: "/favicon.png",
      sizes: "any",
      type: "image/x-icon",
    },
    {
      src: "/icon-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/icon-256x256.png",
      sizes: "256x256",
      type: "image/png",
    },
    {
      src: "/icon-384x384.png",
      sizes: "384x384",
      type: "image/png",
    },
    {
      src: "/icon-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
}

export default function getManifest(): MetadataRoute.Manifest {
  return manifest
}
