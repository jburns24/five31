'use client'

import { signIn } from 'next-auth/react'

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn('google', { callbackUrl: '/account' })}
      className="button"
    >
      Sign in with Google
    </button>
  )
}
