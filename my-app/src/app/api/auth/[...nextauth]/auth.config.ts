// src/app/api/auth/[...nextauth]/auth.config.ts
import { AuthOptions } from "next-auth";
import Auth0 from "next-auth/providers/auth0";
import { prisma } from "@/lib/prisma";
// import { getOrCreateUser } from "@/lib/auth";
import Google from "next-auth/providers/google";

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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!account?.providerAccountId) return false;

      try {
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { googleId: account.providerAccountId },
        });

        if (existingUser) {
          return true; // User exists, proceed with sign in
        }

        // Create new user if they don't exist
        await prisma.user.create({
          data: {
            googleId: account.providerAccountId,
            email: user.email!,
            name: user.name,
          },
        });
        return true;
      } catch (error) {
        console.error("Error during sign in:", error);
        return false;
      }

      // if (account?.provider === "auth0") {
      //   try {
      //     await getOrCreateUser({
      //       id: user.id,
      //       email: user.email!,
      //     });
      //     return true;
      //   } catch (error) {
      //     console.error("Error creating user:", error);
      //     return false;
      //   }
      // }
      // return true;
    },
    async session({ session, token }) {
      if (session.user) {
        // Find user by googleId and map to internal ID
        const dbUser = await prisma.user.findUnique({
          // where: { auth0Id: token.sub },
          where: { googleId: token.sub },
        });
        if (dbUser) {
          session.user.id = dbUser.id; // Use internal ID in session
        }
      }
      return session;
    },
  },
};
