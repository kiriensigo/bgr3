"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-4 p-6">
        <h1 className="text-2xl font-bold text-center">ログイン</h1>
        <button
          onClick={() => signIn("github", { callbackUrl })}
          className="w-full p-2 border rounded-md hover:bg-gray-100"
        >
          GitHubでログイン
        </button>
        <button
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full p-2 border rounded-md hover:bg-gray-100"
        >
          Googleでログイン
        </button>
      </div>
    </div>
  );
} 