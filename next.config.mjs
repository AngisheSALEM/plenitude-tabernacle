import withSerwistInit from "@serwist/next"

process.env.SERWIST_SUPPRESS_TURBOPACK_WARNING = "1"

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "f92ac4d0-0a15-4441-8e03-924e048085e4-00-2e0rhtg5j0jfs.spock.replit.dev",
  ],
  serverExternalPackages: ["@prisma/client", "pg"],
  experimental: {},
  turbopack: {
    resolveAlias: {
      ".prisma/client/default": "./generated/client/default.js",
    },
  },
}

export default withSerwist(nextConfig)
