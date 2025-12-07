/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath: '/Fiberglass-workshop',
  assetPrefix: '/Fiberglass-workshop/',
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
