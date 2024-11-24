// src/components/auth/LoginButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  const handleLogout = () => {
    const returnTo = encodeURI(String(window.location.href));
    const authURL = `${process.env.NEXT_PUBLIC_AUTH0_ISSUER}/v2/logout?client_id=${process.env.NEXT_PUBLIC_AUTH0_ID}&returnTo=${returnTo}`;
    router.push(authURL);
    signOut();
  };

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={
        () => signIn("")

        // signIn("auth0", {
        //   prompt: "login",
        //   callbackUrl: "/",
        //   // Force new login screen
        //   params: {
        //     prompt: "login",
        //     max_age: 0,
        //   },
        // })
      }
      className="bg-blue-500 text-white p-2 rounded"
    >
      Sign in with Auth0
    </button>
  );
}
