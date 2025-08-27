import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: '"ik.imagekit.io"',
      },
    ],
  },
  eslint:{
    ignoreDuringBuilds: true, 
  }
};

export default nextConfig;
