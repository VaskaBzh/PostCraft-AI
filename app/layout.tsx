import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PostCraft AI — Генератор постов',
  description: 'AI-генератор постов для социальных сетей на базе Claude',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
