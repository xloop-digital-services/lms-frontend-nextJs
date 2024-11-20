/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lms-xd-bucket.s3.ap-south-1.amazonaws.com",
        port: "",
        pathname: "/assets/**",
      },
    ],
  },
};

module.exports = nextConfig;
