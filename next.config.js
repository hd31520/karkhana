/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: './src/app', // 👈 tell Next.js exactly where the app dir lives
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
  },
  serverExternalPackages: ['mongoose', 'firebase-admin'],
  output: 'standalone',
};

module.exports = nextConfig;
