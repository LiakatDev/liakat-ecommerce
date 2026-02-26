import { withStoreConfig } from "./store-config"
import store from "./store.config.json"
import { NextConfig } from "next"

/**
 * @type {import('next').NextConfig}
 */

const nextConfig: NextConfig = withStoreConfig({
  features: store.features,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      { protocol: "https", hostname: "*.fra1.cdn.digitaloceanspaces.com" },
      { protocol: "https", hostname: "flatlisteyewear.kontainer.com" },
      {
        protocol: "https",
        hostname: "images.ctfassets.net",
        port: "",
        pathname: "/**",
      },
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
})

module.exports = nextConfig
