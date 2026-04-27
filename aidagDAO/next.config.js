/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Static export removed because Task #3 introduced a server-side
  // autonomous engine (lib/server/orchestrator.ts) that requires Node runtime
  // and dynamic API routes. Deployment compatibility is handled in the
  // follow-up "Cloudflare uyum denetimi + canlıya alma" task.
  images: { unoptimized: true },
};

module.exports = nextConfig;
