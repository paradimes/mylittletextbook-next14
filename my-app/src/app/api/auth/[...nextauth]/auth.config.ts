// src/app/api/auth/[...nextauth]/auth.config.ts
import { AuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import { prisma } from "@/lib/prisma";
import { getOrCreateUser } from "@/lib/auth";

export const authOptions: AuthOptions = {
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID as string,
      clientSecret: process.env.AUTH_AUTH0_SECRET as string,
      issuer: process.env.AUTH_AUTH0_ISSUER,
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
        const dbUser = await prisma.user.findUnique({
          where: { auth0Id: token.sub },
        });
        session.user.id = dbUser?.id;
      }
      return session;
    },
  },
};
