import Link from "next/link"
import Image from "next/image"
import { fetchBGGData, parseXMLResponse } from "@/lib/bggApi"

// サーバーコンポーネントとして宣言
export default async function GamesPage() {
  try {
    // BGG APIのホットゲームリストを取得
    const hotData = await fetchBGGData('hot?type=boardgame')
    const hotDoc = await parseXMLResponse(hotData)
    const gameIds = Array.from(hotDoc.querySelectorAll('item')).map(item => item.getAttribute('id')).filter(Boolean)
    
    // 各ゲームの詳細情報を取得
    const detailsData = await fetchBGGData(`thing?id=${gameIds.join(',')}`)
    const detailsDoc = await parseXMLResponse(detailsData)
    const items = detailsDoc.getElementsByTagName('item')
    
    const games = Array.from(items).map(item => ({
      id: item.getAttribute('id'),
      name: item.querySelector('name[type="primary"]')?.getAttribute('value') || '',
      image: item.querySelector('image')?.textContent || '/placeholder.svg',
      description: item.querySelector('description')?.textContent || '',
      yearPublished: item.querySelector('yearpublished')?.getAttribute('value') || '',
      minPlayers: item.querySelector('minplayers')?.getAttribute('value') || '',
      maxPlayers: item.querySelector('maxplayers')?.getAttribute('value') || '',
      playingTime: item.querySelector('playingtime')?.getAttribute('value') || '',
    }))

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">人気のボードゲーム</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link key={game.id} href={`/games/${game.id}`}>
              <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="relative h-48 mb-4">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-xl font-noto-sans-jp font-bold mb-2">{game.name}</h2>
                <p className="text-gray-600">
                  {game.yearPublished}年 • {game.playingTime}分 • {game.minPlayers}-{game.maxPlayers}人
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching BGG data:', error)
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">データの取得に失敗しました。</p>
      </div>
    )
  }
}

