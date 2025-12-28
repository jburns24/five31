import { getServerSession } from 'next-auth'
import { authOptions } from '../auth'
import { redirect } from 'next/navigation'
import SignOutButton from '@/components/SignOutButton'
import Image from 'next/image'

export default async function Dashboard() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/')
  }

  return (
    <main>
      <div className="card">
        <h1>Dashboard</h1>
        <p>Welcome to your protected dashboard!</p>

        {session.user && (
          <div className="user-info">
            {session.user.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={64}
                height={64}
                className="user-avatar"
              />
            )}
            <div className="user-details">
              <h2>{session.user.name}</h2>
              <p>{session.user.email}</p>
            </div>
          </div>
        )}

        <p>
          This is a server-side rendered page that requires authentication.
          You are successfully signed in with Google!
        </p>

        <SignOutButton />
      </div>
    </main>
  )
}
