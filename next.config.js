/** @type {import('next').NextConfig} */
const prod = process.env.NODE_ENV === 'production';

const runtimeCaching = require('next-pwa/cache');

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  runtimeCaching,
  disable: prod ? false : true
})

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  compiler: {
    styledComponents: true,
  },
  reactStrictMode: false
}

module.exports = withPWA(nextConfig)
