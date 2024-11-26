// src/app/api/auth/[...nextauth]/route.ts
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";

const handler = NextAuth({
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID as string,
      clientSecret: process.env.AUTH_AUTH0_SECRET as string,
      issuer: process.env.AUTH_AUTH0_ISSUER,
      //   authorization: { params: { scope: "openid your_custom_scope" } },
      authorization: {
        url: `https://${process.env.AUTH_AUTH0_ISSUER}/authorize?response_type=code&prompt=login`,
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "auth0") {
        try {
          await getOrCreateUser({
            id: user.id,
            email: user.email!,
          });
          return true;
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // Add internal user id to session
        const dbUser = await prisma.user.findUnique({
          where: { auth0Id: token.sub },
        });
        session.user.id = dbUser?.id;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
