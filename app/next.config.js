const constants = require('../common/constants');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  rewrites: () => [
    {
      source: '/api/:path*',
      destination: `http://${constants.SERVER_HOST}:${constants.SERVER_PORT}/:path*`
    }
  ]
}

module.exports = nextConfig
