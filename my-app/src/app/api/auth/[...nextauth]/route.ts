// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import Auth0 from "next-auth/providers/auth0";

const handler = NextAuth({
  providers: [
    Auth0({
      clientId: process.env.AUTH_AUTH0_ID as string,
      clientSecret: process.env.AUTH_AUTH0_SECRET as string,
      issuer: process.env.AUTH_AUTH0_ISSUER,
      //   wellKnown: `https://${process.env.AUTH_AUTH0_ISSUER}/authorize?response_type=code&prompt=login`,
      //   authorization: { params: { scope: "openid your_custom_scope" } },
      authorization: {
        url: `https://${process.env.AUTH_AUTH0_ISSUER}/authorize?response_type=code&prompt=login`,
      },
    }),
  ],
});

export { handler as GET, handler as POST };
