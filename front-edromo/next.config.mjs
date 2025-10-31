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

  // --- AÑADIDO: Configuración de Imágenes ---
  images: {
    remotePatterns: [
      {
        protocol: 'https', // Asume HTTPS, cambia si es HTTP
        hostname: '37e6ca8b-43ff-46a4-8cba-0a40e79dc62e-00-2962a2qy7dfqe.janeway.replit.dev',
        // port: '', // Añade si usa un puerto específico
        // pathname: '/images/**', // Opcional: si solo quieres permitir imágenes de una carpeta específica
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