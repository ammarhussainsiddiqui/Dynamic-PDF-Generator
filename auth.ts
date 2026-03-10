import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { authConfig } from './auth.config';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email });
        if (!user || (!user.password && user.email)) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password as string, user.password as string);
        if (passwordsMatch) {
          if (!user.isVerified) {
            throw new Error("Please verify your email address to log in.");
          }
          return { id: user._id.toString(), email: user.email, name: user.name };
        }
        
        return null;
      },
    }),
  ],
});
