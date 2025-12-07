/** @type {import('next').NextConfig} */

// For local development, set to false. For GitHub Pages deployment, set to true.
const isGitHubPages = false;

const nextConfig = {
  // Only use 'export' for GitHub Pages
  ...(isGitHubPages && { output: 'export' }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Only use basePath for GitHub Pages
  ...(isGitHubPages && { basePath: '/Fiberglass-workshop' }),
  ...(isGitHubPages && { assetPrefix: '/Fiberglass-workshop/' }),
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig
