import Link from 'next/link'
import Image from 'next/image'

export default function Header() {
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
    </header>
  )
}
