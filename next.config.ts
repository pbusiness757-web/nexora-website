import type { NextConfig } from "next";

// Internal backend URL — used server-side only (not baked into the browser bundle).
// On the VPS set BACKEND_URL=http://localhost:4000 in the pm2 ecosystem or .env.local.
// Defaults to localhost:4000 for local development.
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
