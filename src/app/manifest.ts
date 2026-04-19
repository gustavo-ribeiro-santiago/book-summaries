import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Book Summaries',
    short_name: 'Books',
    description: 'Your Personal Library of Insights',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#fdfcfa',
    theme_color: '#cc4536',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
