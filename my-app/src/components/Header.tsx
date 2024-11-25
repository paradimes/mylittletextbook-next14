// src/components/Header.tsx

import AuthButton from "./auth/AuthButton";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 bg-neutral-300 dark:bg-neutral-600 ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <h1 className="text-xl font-semibold">MyLittleTextbook</h1>
        </div>
        <div className="flex items-center justify-center gap-5">
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
