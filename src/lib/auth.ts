import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Build providers array dynamically based on available config
const providers = [];

// Only add Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && 
    !process.env.GOOGLE_CLIENT_ID.includes("your-google")) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Always add Quick Session for testing
providers.push(
  Credentials({
    id: "quick-session",
    name: "Quick Session",
    credentials: {
      name: { label: "Name", type: "text" },
    },
    async authorize(credentials) {
      if (credentials?.name) {
        return {
          id: `temp-${Date.now()}`,
          name: credentials.name as string,
          email: `${(credentials.name as string).toLowerCase().replace(/\s/g, '')}@temp.session`,
          image: null,
        };
      }
      return null;
    },
  })
);

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
});
