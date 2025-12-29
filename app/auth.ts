import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Connect to MongoDB
        await connectDB()

        // Check if user exists by Google OAuth ID
        const existingUser = await User.findOne({ googleId: account?.providerAccountId })

        if (!existingUser) {
          // Create new user if doesn't exist
          await User.create({
            googleId: account?.providerAccountId as string,
            email: user.email as string,
            name: user.name as string,
            image: user.image as string,
          })
          console.log('New user created:', user.email)
        } else {
          console.log('Existing user signed in:', user.email)
        }

        return true
      } catch (error) {
        // Fail-secure behavior: return false if database operation fails
        console.error('Error during sign-in:', error)
        return false
      }
    },
    async session({ session, token }) {
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
}
