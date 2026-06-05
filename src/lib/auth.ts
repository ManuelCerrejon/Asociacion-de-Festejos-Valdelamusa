import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const allowedAdminEmail = "asoc.soc.cul.valdelamusa@gmail.com";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      return profile?.email === allowedAdminEmail;
    },
    async session({ session }) {
      if (session.user) {
        session.user.email = session.user.email ?? "";
      }

      return session;
    },
  },
  pages: {
    signIn: "/admin",
    error: "/admin",
  },
};

export async function getAdminSession() {
  const session = await getServerSession(authOptions);

  if (session?.user?.email !== allowedAdminEmail) {
    return null;
  }

  return session;
}
