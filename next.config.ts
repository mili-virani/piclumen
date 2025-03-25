/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "", // Requests to /api/get_photos
        destination: "http://68.183.93.60:7979/", // Proxies to backend
      },
    ];
  },
};

module.exports = nextConfig;
