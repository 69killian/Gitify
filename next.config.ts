import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  images: {
    domains: ['github.githubassets.com', 'upload.wikimedia.org'],
  },
};

export default nextConfig;
