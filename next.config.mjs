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
}

export default nextConfig
