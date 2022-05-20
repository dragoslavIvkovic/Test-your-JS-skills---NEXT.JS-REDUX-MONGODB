/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // domains: ['lh3.googleusercontent.com'],
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'], formats: ['image/avif', 'image/webp'],
  },
};

module.exports = nextConfig;
