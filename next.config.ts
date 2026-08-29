import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Rutas en español; se mantienen alias cortos por si circulan enlaces antiguos.
  async redirects() {
    return [
      { source: '/lab', destination: '/laboratorio', permanent: false },
      { source: '/reports', destination: '/informes', permanent: false },
      { source: '/papers', destination: '/aldunate/papers', permanent: false },
    ];
  },
};

export default nextConfig;
