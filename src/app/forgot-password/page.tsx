"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password reset logic
    console.log("Password reset request for", email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="container mx-auto max-w-md p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">パスワード再設定メールを送信しました</h1>
        <p className="mb-4">パスワード再設定のためのリンクを記載したメールを送信しました。メールをご確認ください。</p>
        <Link href="/login" className="text-blue-600 hover:underline">
          ログインページに戻る
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-md p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">パスワード再設定</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full">
          パスワード再設定メールを送信
        </Button>
      </form>
      <div className="mt-6 text-center">
        <Link href="/login" className="text-blue-600 hover:underline">
          ログインページに戻る
        </Link>
      </div>
    </div>
  )
}

