/** @type {import('next').NextConfig} */

import withPayload from '@payloadcms/next/withPayload'

import { env } from './env.mjs'

const { NEXT_PUBLIC_SERVER_URL } = env
const isDev = process.env.NODE_ENV === 'development'
const remotePatterns = [
  ...[NEXT_PUBLIC_SERVER_URL].map((item) => {
    const url = new URL(item)

    return {
      hostname: url.hostname,
      protocol: url.protocol.replace(':', ''),
    }
  }),
  ...(process.env.NODE_ENV === 'development'
    ? [
        {
          protocol: 'http',
          hostname: '192.168.*.*',
          port: '3000',
        },
      ]
    : []),
]
const nextConfig = {
  allowedDevOrigins: ['http://localhost:3000', 'http://localhost:8080'],
  assetPrefix: isDev ? undefined : NEXT_PUBLIC_SERVER_URL,
  images: {
    remotePatterns,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; img-src 'self' data: blob:; media-src 'self';",
    qualities: [75, 90],
    deviceSizes: [640, 960, 1200, 1400, 1920, 3840],
    imageSizes: [240, 480],
  },

  reactStrictMode: true,
  output: 'standalone',
  devIndicators: { position: 'bottom-right' },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
