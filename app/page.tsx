import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { redirect } from 'next/navigation'
import SignInButton from '@/components/SignInButton'

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect('/dashboard')
  }

  return (
    <main>
      <div className="card">
        <h1>Welcome to Next.js Google Auth</h1>
        <p>
          This is a containerized Next.js application with Google authentication.
          Sign in with your Google account to access the dashboard.
        </p>
        <SignInButton />
      </div>
    </main>
  )
}
