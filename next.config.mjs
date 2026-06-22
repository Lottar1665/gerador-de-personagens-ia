/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc', // 👈 Registra o domínio da foto
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;

