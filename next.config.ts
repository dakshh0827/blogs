import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['lh3.googleusercontent.com'], 
  },  
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
  productionBrowserSourceMaps: true,
  compiler: {
    removeConsole: false,
  },
  env: {
    DEBUG: 'true',
  },
};

export default nextConfig;
