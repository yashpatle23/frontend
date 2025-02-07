/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const repoName = 'frontend'; // Change this to your GitHub repo name

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'export', // Enables static export for GitHub Pages
  distDir: 'out', // Output directory for GitHub Pages
  basePath: isProd ? `/${repoName}` : '', // Base path for GitHub Pages
  assetPrefix: isProd ? `/${repoName}/` : '', // Ensure correct asset loading

  images: {
    unoptimized: true, // Required for GitHub Pages (Next.js static export limitation)
  },

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src'), // Shorten imports
    };
    return config;
  },
};

module.exports = nextConfig;
