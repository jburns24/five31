import './globals.css'
import type { Metadata } from 'next'
import { SessionProvider } from '@/components/SessionProvider'

export const metadata: Metadata = {
  title: 'Next.js Google Auth App',
  description: 'A containerized Next.js app with Google authentication',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
