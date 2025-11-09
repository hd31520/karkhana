// src/lib/auth.ts
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from './database';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import type { NextRequest } from 'next/server';

/**
 * NextAuth options: DB-backed authorize + dev fallback.
 * Dev fallback returns a valid-looking ObjectId string to avoid Mongoose CastError.
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Try to authenticate against MongoDB user
          await connectToDatabase();
          const userDoc = await User.findOne({ email: credentials.email }).exec();
          if (!userDoc) return null;

          const isMatch = await userDoc.comparePassword(credentials.password);
          if (!isMatch) return null;

          return {
            id: userDoc._id.toString(),
            email: userDoc.email,
            name: userDoc.name,
            role: userDoc.role,
            emailVerified: userDoc.emailVerified,
          };
        } catch (err) {
          // DB error — fallback to dev behavior but use a valid ObjectId format
          console.warn(
            'Auth: DB error, falling back to dev authorize behavior:',
            (err as any)?.message || err
          );

          // Use a deterministic valid ObjectId-like string for dev fallback
          // (24 hex chars). This prevents Mongoose CastError when routes call findById.
          return {
            id: '000000000000000000000001',
            email: credentials.email,
            name: 'Dev User',
            role: 'user',
            emailVerified: true,
          };
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.emailVerified = (user as any).emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      const s = session as any;
      if (!s.user) s.user = {};
      s.user.id = token.sub!;
      s.user.role = token.role as string;
      s.user.emailVerified = Boolean(token.emailVerified);
      return s as any;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Get user id from server session (App Router friendly).
 * Returns string id (usually a MongoDB ObjectId string) or null.
 */
export async function getUserIdFromSession(_req?: NextRequest | undefined): Promise<string | null> {
  try {
    const session = await getServerSession(authOptions as any);
    return (session as any)?.user?.id ?? null;
  } catch (err) {
    console.warn('getUserIdFromSession error:', (err as any)?.message || err);
    return null;
  }
}

/**
 * Backward-compatible helper:
 * 1) Check header 'x-user-id'
 * 2) Check query param ?userId=...
 * 3) Fallback to session-based id
 */
export async function getUserIdFromReq(
  req?: NextRequest | Request | undefined
): Promise<string | null> {
  try {
    if (req && typeof (req as any).headers?.get === 'function') {
      const hdr = (req as any).headers.get('x-user-id');
      if (hdr) return hdr;

      try {
        const url = new URL((req as any).url);
        const q = url.searchParams.get('userId');
        if (q) return q;
      } catch (_) {
        // ignore malformed url
      }
    }

    return await getUserIdFromSession(req as any);
  } catch (err) {
    console.warn('getUserIdFromReq error:', (err as any)?.message || err);
    return null;
  }
}
