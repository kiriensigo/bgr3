import Link from "next/link"
import Image from "next/image"
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi"

export default async function PopularGamesPage() {
  try {
    // BGG APIのホットゲームリストを取得（遅延を追加）
    const hotData = await fetchBGGData('hot?type=boardgame')
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒待機
    const hotDoc = await parseXMLResponse(hotData)
    const gameIds = Array.from(hotDoc.querySelectorAll('item')).map(item => item.getAttribute('id')).filter(Boolean)
    
    // 各ゲームの詳細情報を取得（遅延を追加）
    const detailsData = await fetchBGGData(`thing?id=${gameIds.slice(0, 10).join(',')}&stats=1`)
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒待機
    const detailsDoc = await parseXMLResponse(detailsData)
    const items = detailsDoc.getElementsByTagName('item')
    
    const games = Array.from(items).map(item => ({
      id: item.getAttribute('id'),
      name: item.querySelector('name[type="primary"]')?.getAttribute('value') || '',
      image: item.querySelector('image')?.textContent || '/placeholder.svg',
      averageScore: parseFloat(
        item.querySelector('statistics ratings average')?.getAttribute('value') || '0'
      ),
      yearPublished: item.querySelector('yearpublished')?.getAttribute('value') || '',
    }))

    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          人気のボードゲーム
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link href={`/games/${game.id}`} key={game.id}>
              <div className="game-card group relative">
                <div className="relative w-full h-80">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    style={{ objectFit: "cover", objectPosition: "center 20%" }}
                    className="object-center"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      詳細を見る
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-noto-sans-jp font-bold mb-2">
                    {game.name}
                  </h2>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-600 mr-2">BGG評価：</span>
                      <span className="text-gray-600 font-bold text-2xl">
                        {game.averageScore.toFixed(1)}
                      </span>
                    </div>
                    {game.yearPublished && (
                      <span className="text-sm text-gray-500">
                        {game.yearPublished}年
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
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