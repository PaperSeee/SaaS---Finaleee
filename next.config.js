/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'randomuser.me',
      'lh3.googleusercontent.com', // Google user profile images
    ],
  },
  eslint: {
    // Ignorer ESLint pendant la build (déjà exécuté en local si vous le souhaitez)
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
