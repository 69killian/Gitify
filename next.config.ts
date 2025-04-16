import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */

const nextConfig: NextConfig = {
  images: {
    domains: ['github.githubassets.com', 'upload.wikimedia.org', 'via.placeholder.com', 'avatars.githubusercontent.com'],
  },
};

export default nextConfig;
