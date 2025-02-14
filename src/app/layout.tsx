import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ボードゲームレビュー",
  description: "ボードゲームのレビューサイト",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <header className="bg-primary text-primary-foreground p-4 shadow-md">
          <nav className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-display text-primary-foreground">
                <Link
                  href="/"
                  className="text-primary-foreground hover:text-accent transition-colors"
                >
                  ボドゲレビュー
                </Link>
              </h1>
              <div className="space-x-6">
                <Link
                  href="/"
                  className="hover:text-accent transition-colors duration-300"
                >
                  ホーム
                </Link>
                <Link
                  href="/popular"
                  className="hover:text-accent transition-colors duration-300"
                >
                  人気のゲーム
                </Link>
                <Link
                  href="/games"
                  className="hover:text-accent transition-colors duration-300"
                >
                  ゲーム一覧
                </Link>
                <Link
                  href="/search"
                  className="hover:text-accent transition-colors duration-300"
                >
                  検索
                </Link>
              </div>
            </div>
            <div className="space-x-4">
              <Link
                href="/signup"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors"
              >
                新規登録
              </Link>
              <Link
                href="/login"
                className="bg-secondary text-secondary-foreground px-4 py-2 rounded-full hover:bg-secondary/80 transition-colors"
              >
                ログイン
              </Link>
            </div>
          </nav>
        </header>

        <main className="min-h-screen">{children}</main>

        <footer className="p-4 mt-8">
          <div className="container mx-auto text-center">
            <p>&copy; 2024 ボードゲームレビュー. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
