/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
    return [
      {
        source: '/',          // La ruta de origen (la homepage por defecto)
        destination: '/grupo2/login/page', // La ruta a donde quieres redirigir
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
