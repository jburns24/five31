'use client'

interface HamburgerIconProps {
  onClick: () => void
}

export default function HamburgerIcon({ onClick }: HamburgerIconProps) {
  return (
    <button
      className="hamburger-icon"
      onClick={onClick}
      aria-label="Open navigation menu"
    >
      <span></span>
      <span></span>
      <span></span>
    </button>
  )
}
