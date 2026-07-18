import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: [
    '@numerus/shared-kernel',
    '@numerus/numerology-domain',
    '@numerus/numerology-application',
  ],
}

export default nextConfig
