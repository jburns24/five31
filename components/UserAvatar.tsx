'use client'

import Image from 'next/image'

interface UserAvatarProps {
  name: string
  image: string | null
  size?: number
}

// Generate a deterministic color based on the name
function getColorFromName(name: string): string {
  const colors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#6366f1', // indigo
    '#f43f5e', // rose
  ]
  
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}

// Get initials from name (first letter of first and last name)
function getInitials(name: string): string {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return parts[0].substring(0, 2).toUpperCase()
}

export default function UserAvatar({ name, image, size = 80 }: UserAvatarProps) {
  if (image) {
    return (
      <Image
        src={image}
        alt={`${name}'s profile picture`}
        width={size}
        height={size}
        className="user-avatar"
      />
    )
  }

  const initials = getInitials(name)
  const backgroundColor = getColorFromName(name)

  return (
    <div
      className="user-avatar-initials"
      style={{
        width: size,
        height: size,
        backgroundColor,
      }}
    >
      {initials}
    </div>
  )
}
