import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Pin the workspace root to this project. Without it Turbopack walks up and
   * finds an unrelated lockfile in the user's home directory.
   */
  turbopack: {
    root: path.resolve(),
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
