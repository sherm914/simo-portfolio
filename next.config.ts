import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'supabase.co',
      },
    ],
    formats: ['image/avif', 'image/webp'], // Modern formats first, PNG fallback
  },
  // Enable compression for all responses
  compress: true,
};

export default nextConfig;
