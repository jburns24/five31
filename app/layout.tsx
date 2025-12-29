import './globals.css'
import type { Metadata } from 'next'
import { SessionProvider } from '@/components/SessionProvider'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Next.js Google Auth App',
  description: 'A containerized Next.js app with Google authentication',
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
