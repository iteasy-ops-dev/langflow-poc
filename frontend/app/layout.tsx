import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ITEASY AI Automation Platform',
  description: 'AI-powered business automation with Langflow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
