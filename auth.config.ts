import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  providers: [], // Configured in auth.ts along with db logic
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/templates');
      const isAuthPage = nextUrl.pathname === '/login' || nextUrl.pathname === '/register' || nextUrl.pathname === '/forgot-password' || nextUrl.pathname.startsWith('/reset-password');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
