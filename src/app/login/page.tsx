"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle, FaTwitter } from "react-icons/fa"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement login logic
    console.log("Login attempt", { email, password })
  }

  const handleGoogleLogin = () => {
    // TODO: Implement Google login
    console.log("Google login")
  }

  const handleTwitterLogin = () => {
    // TODO: Implement Twitter login
    console.log("Twitter login")
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">ログイン</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="password">パスワード</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          ログイン
        </Button>
      </form>
      <div className="mt-4">
        <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">
          パスワードをお忘れですか？
        </Link>
      </div>
      <div className="mt-6">
        <p className="text-center text-sm mb-2">または</p>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full bg-[#4285F4] text-white hover:bg-[#357AE8]"
            onClick={handleGoogleLogin}
          >
            <FaGoogle className="mr-2" /> Googleでログイン
          </Button>
          <Button
            variant="outline"
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={handleTwitterLogin}
          >
            <FaTwitter className="mr-2" /> X（Twitter）でログイン
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm">
          アカウントをお持ちでない方は{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            新規登録
          </Link>
        </p>
      </div>
    </div>
  )
}

