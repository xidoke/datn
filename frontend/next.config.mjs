/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: ["lucide-react"],
  trailingSlash: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "xidoke.id.vn",
        port: "",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/uploads/**",
      },
    ],
  },

  redirects: async () => {
    return [
      {
        source: "/login",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
