import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/db";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectToDatabase();
        let user = await User.findOne({ email: credentials.email });
        
        // If user doesn't exist, create them for ease of testing in this project
        if (!user) {
          const hashedPassword = bcrypt.hashSync(credentials.password, 10);
          user = await User.create({
            email: credentials.email,
            password: hashedPassword
          });
          return { id: user._id.toString(), email: user.email };
        }

        // If user exists, check password
        if (user.password && bcrypt.compareSync(credentials.password, user.password)) {
          return { id: user._id.toString(), email: user.email };
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.sub as string;
      }
      return session;
    }
  },
  pages: { signIn: '/' },
  secret: process.env.AUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
