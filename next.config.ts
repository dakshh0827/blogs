import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com'], 
  },
   experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs'],
  },
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: false,
  }
};

export default nextConfig;
