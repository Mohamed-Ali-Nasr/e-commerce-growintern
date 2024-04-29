/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.APP_URL],
  },
};

export default nextConfig;
