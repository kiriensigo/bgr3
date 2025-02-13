import "./globals.css"
import { Inter } from "next/font/google"
import Header from "./components/Header"
import Footer from "./components/Footer"
import { NextAuthProvider } from "./providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ボードゲームレビュー",
  description: "ボードゲームのレビューと情報を共有するサイト",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className={`${inter.className} flex flex-col min-h-screen bg-background text-text`}>
        <NextAuthProvider>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
          <Footer />
        </NextAuthProvider>
      </body>
    </html>
  )
}

