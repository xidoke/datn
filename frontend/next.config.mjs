/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["lucide-react"],
  trailingSlash: true,
  images: {
    domains: ["localhost"],
  },
};

export default nextConfig;
