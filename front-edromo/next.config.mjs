import path from "path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(process.cwd(), "src"),
    };
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.janeway.replit.dev",
      },
      {
        protocol: "https",
        hostname: "*.riker.replit.dev",
      },
      {
        protocol: "https",
        hostname: "*.replit.dev",
      },
    ],
  },
};

export default nextConfig;
