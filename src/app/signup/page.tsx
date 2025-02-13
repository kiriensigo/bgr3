"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FaGoogle, FaTwitter } from "react-icons/fa"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement signup logic
    console.log("Signup attempt", { email, password, confirmPassword })
  }

  const handleGoogleSignup = () => {
    // TODO: Implement Google signup
    console.log("Google signup")
  }

  const handleTwitterSignup = () => {
    // TODO: Implement Twitter signup
    console.log("Twitter signup")
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">新規登録</h1>
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
        <div>
          <Label htmlFor="confirmPassword">パスワード（確認）</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          新規登録
        </Button>
      </form>
      <div className="mt-6">
        <p className="text-center text-sm mb-2">または</p>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full bg-[#4285F4] text-white hover:bg-[#357AE8]"
            onClick={handleGoogleSignup}
          >
            <FaGoogle className="mr-2" /> Googleで新規登録
          </Button>
          <Button
            variant="outline"
            className="w-full bg-black text-white hover:bg-gray-800"
            onClick={handleTwitterSignup}
          >
            <FaTwitter className="mr-2" /> X（Twitter）で新規登録
          </Button>
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-sm">
          すでにアカウントをお持ちの方は{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            ログイン
          </Link>
        </p>
      </div>
    </div>
  )
}

