export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold">ボドゲレビュー</h3>
            <p className="mt-2">ボードゲームの情報共有とレビューのためのプラットフォーム</p>
          </div>
          <div className="flex flex-col space-y-2">
            <a href="/about" className="hover:text-accent">サイトについて</a>
            <a href="/terms" className="hover:text-accent">利用規約</a>
            <a href="/privacy" className="hover:text-accent">プライバシーポリシー</a>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 ボドゲレビュー All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 