"use client";

import { signIn } from "next-auth/react";

export default function LoginForm() {
  const handleLogin = async () => {
    await signIn("zitadel", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div
      className="
        w-[500px]
        rounded-2xl
        border border-zinc-800
        p-8
        shadow-2xl
        backdrop-blur
      "
    >
      <div className="space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold">Reel Management System</h1>

          <p className="mt-2 text-zinc-400">
            Sign in with your company account to continue.
          </p>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="
            h-10
            w-full
            rounded-md
            bg-white
            font-medium
            text-black
            transition-colors
            hover:bg-zinc-200
          "
        >
          Continue with Company Login
        </button>
      </div>
    </div>
  );
}
