import type { NextConfig } from 'next';

const base = new URL(process.env.NEXT_PUBLIC_CDN_BASE!);

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  images: {
    remotePatterns: [{ protocol: 'https', hostname: base.hostname, }]
  }
};

export default nextConfig;
