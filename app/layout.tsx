import './globals.css'
import type { Metadata } from 'next'
import { SessionProvider } from '@/components/SessionProvider'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: '5/3/1 Workout Tracker',
  description: 'Track your 5/3/1 strength training workouts. Built for lifters who want consistent, measurable strength gains using Jim Wendler\'s proven methodology.',
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
        <SessionProvider>
          <Header />
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
