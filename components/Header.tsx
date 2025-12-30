'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import HamburgerIcon from './HamburgerIcon'
import MobileNav from './MobileNav'
import DesktopNav from './DesktopNav'

export default function Header() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <header className="header">
      <Link href="/" className="header-logo">
        <Image
          src="/favicon.png"
          alt="Logo"
          width={40}
          height={40}
          priority
        />
      </Link>
      <DesktopNav />
      <HamburgerIcon onClick={() => setIsMobileNavOpen(true)} />
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  )
}
