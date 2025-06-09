/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Handle .lynx files
    config.module.rules.push({
      test: /\.lynx$/,
      use: [
        {
          loader: '@lynx/webpack-loader',
          options: {
            isServer,
          },
        },
      ],
    });

    return config;
  },
  // Enable experimental features for Lynx integration
  experimental: {
    appDir: true,
    serverComponents: true,
  },
}

module.exports = nextConfig 