/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/get_photos", // Requests to /api/get_photos
        destination: "http://68.183.93.60:7979/get_photos", // Proxies to backend
      },
    ];
  },
};

module.exports = nextConfig;
