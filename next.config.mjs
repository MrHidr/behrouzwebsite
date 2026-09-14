import { withPayload } from "@payloadcms/next/withPayload";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Keep production builds reliable on the small Linux handover server. The
  // application scales at runtime independently of build-time worker count.
  experimental: {
    cpus: 1,
    memoryBasedWorkersCount: false,
  },
  output: process.env.PAYLOAD_DB === "d1" ? undefined : "standalone",
  serverExternalPackages: ["jose", "pg-cloudflare"],
  images: {
    // Cloudflare's own image resizing isn't wired up here yet, so ship
    // pre-optimized webp (see scripts/optimize-media.mjs) and skip Next's
    // built-in image optimizer, which needs a Node server it won't have here.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  async headers() {
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "SAMEORIGIN" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
      },
      ...(process.env.NODE_ENV === "production"
        ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
        : []),
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/api/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
      {
        source: "/admin/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store" }],
      },
    ];
  },
  webpack(webpackConfig) {
    webpackConfig.resolve.extensionAlias = {
      ".cjs": [".cts", ".cjs"],
      ".js": [".ts", ".tsx", ".js", ".jsx"],
      ".mjs": [".mts", ".mjs"],
    };
    return webpackConfig;
  },
};

export default withPayload(nextConfig, { devBundleServerPackages: false });

// Enables `wrangler dev`-style local bindings (env vars, KV, R2, etc.) inside
// `next dev`, so local development matches the Cloudflare runtime.
initOpenNextCloudflareForDev();
