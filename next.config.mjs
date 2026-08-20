/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // sql.js ships a .wasm binary that webpack can't parse as a JS module.
  // Keeping it external means the server bundle just `require()`s it
  // natively at runtime instead of trying to bundle it.
  experimental: {
    serverComponentsExternalPackages: ["sql.js"],
    // The scorer builds the wasm path as a plain string (not require.resolve)
    // so webpack never sees it — which also means Vercel's file tracer
    // wouldn't know to include it in the deployed function bundle without
    // this explicit hint.
    outputFileTracingIncludes: {
      "/api/**/*": ["./node_modules/sql.js/dist/sql-wasm.wasm"],
    },
  },
};

export default nextConfig;
