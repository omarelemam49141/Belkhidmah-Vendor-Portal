import type { NextConfig } from 'next'

const isGithubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig: NextConfig = {
  experimental: {
    turbopackUseSystemTlsCerts: true
  },
  images: {
    unoptimized: isGithubPages
  }
}

if (isGithubPages) {
  const pagesBasePath = '/Belkhidmah-Vendor-Portal'
  process.env.NEXT_PUBLIC_BASE_PATH = pagesBasePath
  nextConfig.output = 'export'
  nextConfig.trailingSlash = true
  nextConfig.basePath = pagesBasePath
}

export default nextConfig
