/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Cloudflare's own image resizing isn't wired up here yet, so ship
    // pre-optimized webp (see scripts/optimize-media.mjs) and skip Next's
    // built-in image optimizer, which needs a Node server it won't have here.
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

// Enables `wrangler dev`-style local bindings (env vars, KV, R2, etc.) inside
// `next dev`, so local development matches the Cloudflare runtime.
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
