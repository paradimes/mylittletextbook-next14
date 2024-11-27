// src/components/SignInModal.tsx

import { signIn } from "next-auth/react";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal */}
      <div className="relative rounded-lg bg-white dark:bg-neutral-900 p-6 max-w-sm w-full mx-4 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">
          Sign in to bookmark topics
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Create an account to bookmark topics and access them later.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => signIn("auth0")}
            className="flex items-center justify-center gap-2 rounded-md px-4 py-2
                     bg-neutral-950 text-white hover:bg-neutral-800 
                     border-2 border-neutral-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-log-in"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" x2="3" y1="12" y2="12" />
            </svg>
            Sign in
          </button>

          <button
            onClick={onClose}
            className="text-sm text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
