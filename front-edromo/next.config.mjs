import path from "path";
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración de Webpack para alias (la tenías antes)
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
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      // Puedes añadir más objetos aquí si necesitas permitir otros dominios
      // Ejemplo: { protocol: 'https', hostname: 'otro.dominio.com' }
    ],
  },
  // --- FIN AÑADIDO ---
};

export default nextConfig;