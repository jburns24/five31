import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/auth'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export default async function StatsPage() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    redirect('/')
  }

  await connectDB()

  const user = await User.findOne({ email: session.user.email }).lean()

  if (!user) {
    redirect('/')
  }

  return (
    <main className="stats-page">
      <div className="stats-container">
        <h1 className="stats-title">My Stats</h1>

        {/* Theoretical 1RM Section - Placeholder */}
        <section className="stats-section">
          <h2 className="stats-section-title">Theoretical 1RM</h2>
          <p className="stats-placeholder">Coming soon...</p>
        </section>

        {/* Heaviest AMRAP Records Section - Placeholder */}
        <section className="stats-section">
          <h2 className="stats-section-title">Heaviest AMRAP Records</h2>
          <p className="stats-placeholder">Coming soon...</p>
        </section>

        {/* 1RM Progress Chart Section - Placeholder */}
        <section className="stats-section">
          <h2 className="stats-section-title">1RM Progress</h2>
          <p className="stats-placeholder">Coming soon...</p>
        </section>
      </div>
    </main>
  )
}
