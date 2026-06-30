import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PostCraft AI',
    short_name: 'PostCraft',
    description: 'AI-powered social media post generator built on Claude',
    start_url: '/',
    display: 'standalone',
    background_color: '#080810',
    theme_color: '#7c3aed',
    categories: ['productivity', 'social'],
    icons: [
      {
        src: '/icons/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'maskable',
      },
    ],
  }
}
