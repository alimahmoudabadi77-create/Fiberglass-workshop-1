/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',  // غیرفعال برای توسعه محلی
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // basePath: '/Fiberglass-workshop',  // غیرفعال برای توسعه محلی
  // assetPrefix: '/Fiberglass-workshop/',  // غیرفعال برای توسعه محلی
  // اجازه صفحات داینامیک که client-side رندر می‌شوند
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
