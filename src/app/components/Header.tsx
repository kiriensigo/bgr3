'use client'

import Link from "next/link"
import { useSession, signOut } from "next-auth/react"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <Link href="/" className="text-3xl font-display mb-4 sm:mb-0">
          ボドゲレビュー
        </Link>
        <nav>
          <ul className="flex flex-wrap justify-center sm:space-x-6">
            <li className="mx-2 my-1">
              <Link href="/" className="hover:text-accent transition-colors duration-300">
                ホーム
              </Link>
            </li>
            <li className="mx-2 my-1">
              <Link href="/games" className="hover:text-accent transition-colors duration-300">
                ゲーム一覧
              </Link>
            </li>
            <li className="mx-2 my-1">
              <Link href="/search" className="hover:text-accent transition-colors duration-300">
                検索
              </Link>
            </li>
            {session ? (
              <>
                <li className="mx-2 my-1">
                  <Link href="/profile" className="hover:text-accent">
                    プロフィール
                  </Link>
                </li>
                <li className="mx-2 my-1">
                  <button onClick={() => signOut()} className="hover:text-accent">
                    ログアウト
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="mx-2 my-1">
                  <Link href="/login" className="hover:text-accent">
                    ログイン
                  </Link>
                </li>
                <li className="mx-2 my-1">
                  <Link href="/signup" className="hover:text-accent">
                    新規登録
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
} 