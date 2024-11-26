/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["lucide-react"],
  trailingSlash: true,
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
