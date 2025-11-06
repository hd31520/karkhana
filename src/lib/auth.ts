// src/lib/auth.ts
import NextAuth, { type DefaultSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectToDatabase } from '@/lib/mongodb'
import User from '@/models/User'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession['user']
  }

  interface User {
    role: string
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('No credentials provided')
          return null
        }

        try {
          await connectToDatabase()
          
          const user = await User.findOne({ email: credentials.email.toLowerCase() })
          
          if (!user) {
            console.log('User not found:', credentials.email)
            return null
          }

          const isPasswordValid = await user.comparePassword(credentials.password as string)
          
          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email)
            return null
          }

          console.log('User authenticated successfully:', user.email)

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
})