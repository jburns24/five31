import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import UserAvatar from '@/components/UserAvatar'
import SignOutButton from '@/components/SignOutButton'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/')
  }

  await connectDB()
  
  const user = await User.findOne({ email: session.user.email }).lean()

  if (!user) {
    redirect('/')
  }

  // Format the creation date
  const createdDate = new Date(user.createdAt)
  const formattedDate = createdDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="account-page">
      <div className="account-card">
        <div className="account-header">
          <UserAvatar
            name={user.name}
            image={user.image}
            size={80}
          />
          <div className="account-info">
            <h1>{user.name}</h1>
            <p className="account-email">{user.email}</p>
            <p className="account-joined">Member since {formattedDate}</p>
          </div>
        </div>
        <div className="account-actions">
          <SignOutButton />
        </div>
      </div>
    </main>
  )
}
