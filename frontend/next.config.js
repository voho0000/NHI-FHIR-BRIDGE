/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for the production Docker image: `next build` emits
  // .next/standalone/server.js with a pruned node_modules so the runtime
  // stage doesn't need the full dependency tree (see Dockerfile).
  output: "standalone",
}
module.exports = nextConfig
