import Link from "next/link"
import Image from "next/image"
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi"

export default async function PopularGamesPage() {
  try {
    // BGG APIのホットゲームリストを取得
    const hotData = await fetchBGGData('hot?type=boardgame')
    const hotDoc = await parseXMLResponse(hotData)
    // ... 残りのコードは現在のホームページと同じ ...

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          人気のボードゲーム
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            // ... 現在のホームページのゲームカードと同じ ...
          ))}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching BGG data:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">データの取得に失敗しました。</p>
      </div>
    )
  }
} 