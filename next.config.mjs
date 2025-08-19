// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
//   images: {
//     unoptimized: true,
//   },
// }

// export default nextConfig

// import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
    };
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig

// export default withPWA({
//   dest: 'public',      // service worker file will be placed in /public
//   register: true,      // automatically registers service worker
//   skipWaiting: true,   // activate new SW without refreshing
//   swSrc: 'lib/custom-sw.js', // ✅ custom SW with push + cache
//   // buildExcludes: [/middleware-manifest\.json$/], // prevent caching build artifacts
//   // disable: process.env.NODE_ENV === 'development', // disable in dev mode
// })(nextConfig);
