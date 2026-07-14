/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ships smaller HTML/JS by removing the dev-only React properties in production
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Route-level code splitting is automatic with the App Router;
  // this just makes sure production builds stay lean and traceable.
  productionBrowserSourceMaps: false,
};

module.exports = nextConfig;
