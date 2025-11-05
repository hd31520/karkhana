/** @type {import('next').NextConfig} */
const nextConfig = {
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
