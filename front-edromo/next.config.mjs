import path from "path";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Webpack para alias
  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": path.resolve(process.cwd(), "src"),
    };
    return config;
  },

  // Configuración de Imágenes - CORREGIDA
  images: {
    domains: [
      'via.placeholder.com',
      'placehold.co',
      'i0.wp.com',
      '37e6ca8b-43ff-46a4-8cba-0a40e79dc62e-00-2962a2qy7dfqe.janeway.replit.dev',
      '0b6f33a6-f216-4645-98ae-d4fef9b8eee6-00-200tr4xsxrq60.riker.replit.dev'
    ],
    // O si prefieres usar remotePatterns (una u otra, no ambas):
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'i0.wp.com',
      },
      {
        protocol: 'https',
        hostname: '37e6ca8b-43ff-46a4-8cba-0a40e79dc62e-00-2962a2qy7dfqe.janeway.replit.dev',
      },
      {
        protocol: 'https',
        hostname: '0b6f33a6-f216-4645-98ae-d4fef9b8eee6-00-200tr4xsxrq60.riker.replit.dev',
      },
      {
        protocol: 'https',
        hostname: 'ejemplo.com',
      },
    ],
  },

  // Configuración de Turbopack para eliminar el warning
  turbopack: {
    // Especifica explícitamente el directorio raíz
    root: process.cwd(),
  },
};

export default nextConfig;