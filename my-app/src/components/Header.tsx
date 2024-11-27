// src/components/Header.tsx

import Link from "next/link";
import AuthButton from "./auth/AuthButton";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="border-b border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-950 ">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-library-big"
          >
            <rect width="8" height="18" x="3" y="3" rx="1" />
            <path d="M7 3v18" />
            <path d="M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z" />
          </svg>
          <h1 className="text-xl font-semibold">MyLittleTextbook</h1>
        </Link>
        <div className="flex items-center justify-center gap-5">
          <Link
            href="/bookmarks"
            className="hover:bg-neutral-100 dark:hover:bg-neutral-700 p-2 rounded flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
            </svg>
            Bookmarks
          </Link>{" "}
          <AuthButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
