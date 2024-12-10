// src/components/auth/LoginButton.tsx
"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (session) {
    return (
      <div>
        <button
          onClick={() => signOut()}
          className=" hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => signIn("google")}
      className=" hover:bg-neutral-100 dark:hover:bg-neutral-800 p-2 rounded"
    >
      Sign in
    </button>
  );
}
