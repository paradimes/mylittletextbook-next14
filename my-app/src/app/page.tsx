// src/app/page.tsx

"use client";

import LoginButton from "@/components/auth/LoginButton";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <LoginButton />
    </main>
  );
}
