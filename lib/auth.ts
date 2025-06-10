// lib/auth.js
import { getServerSession, NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

import { DefaultSession, DefaultUser } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
    } & DefaultSession["user"]
  }
  interface User extends DefaultUser {
    id: string
  }
}

export const authOptions: NextAuthOptions = {
  ...(process.env.NODE_ENV !== 'production' || process.env.DATABASE_URL ? {
    adapter: PrismaAdapter(prisma)
  } : {}),
  
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
          return null
        }

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials')
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user || !user.password) {
            throw new Error('Invalid credentials')
          }

          if (!user.emailVerified) {
            throw new Error('Please verify your email before signing in')
          }

          const isCorrectPassword = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isCorrectPassword) {
            throw new Error('Invalid credentials')
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('Authentication failed')
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  }
}

export const getAuthSession = () => getServerSession(authOptions)