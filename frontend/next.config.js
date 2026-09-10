/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  reactStrictMode: true,
  // Disable dev indicators
  devIndicators: {
    autoPrerender: false,
  },
  // Disable React DevTools
  compiler: {
    removeConsole: false,
  },
};

module.exports = nextConfig;