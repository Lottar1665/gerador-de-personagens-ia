/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '://dicebear.com', // 🚀 ATUALIZADO: Libera o servidor de avatares
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
