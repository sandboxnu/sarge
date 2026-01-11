import type { NextConfig } from 'next';

const base = process.env.NEXT_PUBLIC_CDN_BASE;

const nextConfig: NextConfig = {
    /* config options here */
    output: 'standalone',
    images: base
        ? {
              remotePatterns: [{ protocol: 'https', hostname: new URL(base).hostname }],
          }
        : {},
};

export default nextConfig;
