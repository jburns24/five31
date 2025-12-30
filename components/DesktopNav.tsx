'use client'

import Link from 'next/link'
import { useSession, signIn } from 'next-auth/react'

export default function DesktopNav() {
  const { data: session } = useSession()

  return (
    <nav className="desktop-nav">
      <ul className="desktop-nav-items">
        <li>
          <Link href="/">Home</Link>
        </li>
        {session ? (
          <li>
            <Link href="/account">Profile</Link>
          </li>
        ) : (
          <li>
            <button onClick={() => signIn('google', { callbackUrl: '/account' })}>Sign In</button>
          </li>
        )}
      </ul>
    </nav>
  )
}
