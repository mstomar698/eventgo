/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/pages',
        destination: '/',
        permanent: true,
      },
      // Templates were consolidated into Themes (the single library). The /api/templates
      // data + the planner's ?template= flow remain; only the browse UI is retired.
      {
        source: '/templates',
        destination: '/themes',
        permanent: false,
      },
      {
        source: '/templates/:path*',
        destination: '/themes',
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
};

module.exports = nextConfig;
