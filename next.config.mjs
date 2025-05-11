/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com', // For Google profile photos
      'graph.facebook.com', // For Facebook profile photos
      'platform-lookaside.fbsbx.com',
      'static.xx.fbcdn.net',
    ],
  },
  // Enable Brotli compression for smaller bundle sizes
  compress: true,
  // Add experimental features for better performance
  experimental: {
    // Optimize CSS by hoisting
    optimizeCss: true,
    // Optimize React server components
    serverComponents: true,
    // Enable memory cache for faster builds
    memoryBasedWorkersCount: true,
  },
  swcMinify: true, // Use SWC minifier for faster builds
  compiler: {
    // Remove console.log statements in production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default nextConfig;
