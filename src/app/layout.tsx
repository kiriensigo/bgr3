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
            <h1 className="text-2xl font-bold">
              <Link href="/">ボードゲームレビュー</Link>
            </h1>
            <div className="space-x-4">
              <Link href="/" className="nav-button">
                ホーム
              </Link>
              <Link href="/games" className="nav-button">
                ゲーム一覧
              </Link>
              <Link href="/search" className="nav-button">
                検索
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
