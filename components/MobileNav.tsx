'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { data: session } = useSession()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      <div className="mobile-nav-backdrop" onClick={onClose} />
      <nav className={`mobile-nav ${isOpen ? 'mobile-nav-open' : ''}`}>
        <button
          className="mobile-nav-close"
          onClick={onClose}
          aria-label="Close navigation menu"
        >
          ✕
        </button>
        <ul className="mobile-nav-items">
          <li>
            <Link href="/" onClick={onClose}>
              Home
            </Link>
          </li>
          {session ? (
            <li>
              <Link href="/account" onClick={onClose}>
                Profile
              </Link>
            </li>
          ) : (
            <li>
              <Link href="/api/auth/signin" onClick={onClose}>
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  )
}
