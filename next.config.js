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

  // Required to handle src/app structure
  experimental: {
    appDir: true,
  },

  // Required for Firebase Admin + Mongoose
  serverExternalPackages: ['mongoose', 'firebase-admin'],

  // Tell Next where your app directory is
  distDir: '.next',

  // Ensure correct path resolution for deployment
  output: 'standalone',
};

module.exports = nextConfig;
