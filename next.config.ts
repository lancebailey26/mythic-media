/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '20mb', // Increase this as needed
    },
  },
  api: {
    bodyParser: {
      sizeLimit: '20mb', // For traditional API routes too
    },
  },
};

export default nextConfig;
