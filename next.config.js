/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async redirects() {
    return [
      {
        source: '/pages',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
